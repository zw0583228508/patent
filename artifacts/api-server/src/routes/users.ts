import { Router } from "express";
import { and, desc, eq, ilike, inArray, not, or, sql } from "drizzle-orm";
import { db, users, posts, follows } from "../db";
import { sendPushToUser } from "../lib/pushNotifications";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { search, limit = "20", offset = "0" } = req.query as Record<string, string>;
    const list = await db
      .select()
      .from(users)
      .where(search ? or(ilike(users.name, `%${search}%`), ilike(users.username, `%${search}%`)) : undefined)
      .limit(parseInt(limit))
      .offset(parseInt(offset));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.params.id));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.post("/upsert", async (req, res) => {
  try {
    const { id, name, username, bio, avatarGradient, categoryId } = req.body;
    if (!id || !name || !username) return res.status(400).json({ error: "id, name, username required" });

    const [user] = await db
      .insert(users)
      .values({ id, name, username, bio, avatarGradient, categoryId })
      .onConflictDoUpdate({ target: users.id, set: { name, bio, avatarGradient, categoryId } })
      .returning();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upsert user" });
  }
});

router.post("/:id/notif-prefs", async (req, res) => {
  try {
    const { notifComments, notifLikes, notifFollows, notifVotes, notifCommentsFilter, notifVotesFilter, notifTopicsFilter } = req.body;
    const update: Partial<typeof users.$inferInsert> = {};
    if (notifComments !== undefined) update.notifComments = Boolean(notifComments);
    if (notifLikes !== undefined) update.notifLikes = Boolean(notifLikes);
    if (notifFollows !== undefined) update.notifFollows = Boolean(notifFollows);
    if (notifVotes !== undefined) update.notifVotes = Boolean(notifVotes);
    const validFilters = ["all", "tips", "questions", "comments"];
    if (notifCommentsFilter && validFilters.includes(notifCommentsFilter)) update.notifCommentsFilter = notifCommentsFilter;
    if (notifVotesFilter && validFilters.includes(notifVotesFilter)) update.notifVotesFilter = notifVotesFilter;
    if (notifTopicsFilter && validFilters.includes(notifTopicsFilter)) update.notifTopicsFilter = notifTopicsFilter;

    if (Object.keys(update).length === 0) return res.status(400).json({ error: "No prefs to update" });

    await db.update(users).set(update).where(eq(users.id, req.params.id));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update notif prefs" });
  }
});

router.post("/:id/push-token", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "token required" });

    await db
      .update(users)
      .set({ pushToken: token, pushTokenUpdatedAt: new Date() })
      .where(eq(users.id, req.params.id));

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save push token" });
  }
});

router.get("/:id/posts", async (req, res) => {
  try {
    const { limit = "20", offset = "0" } = req.query as Record<string, string>;
    const list = await db
      .select()
      .from(posts)
      .where(eq(posts.authorId, req.params.id))
      .orderBy(desc(posts.createdAt))
      .limit(parseInt(limit))
      .offset(parseInt(offset));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
});

router.get("/:id/followers", async (req, res) => {
  try {
    const list = await db
      .select({ user: users })
      .from(follows)
      .innerJoin(users, eq(follows.followerId, users.id))
      .where(eq(follows.followingId, req.params.id));
    res.json(list.map((r) => r.user));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch followers" });
  }
});

router.get("/:id/following", async (req, res) => {
  try {
    const list = await db
      .select({ user: users })
      .from(follows)
      .innerJoin(users, eq(follows.followingId, users.id))
      .where(eq(follows.followerId, req.params.id));
    res.json(list.map((r) => r.user));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch following" });
  }
});

router.post("/:id/follow", async (req, res) => {
  try {
    const { followerId } = req.body;
    if (!followerId) return res.status(400).json({ error: "followerId required" });
    if (followerId === req.params.id) return res.status(400).json({ error: "Cannot follow yourself" });

    const existing = await db.select().from(follows).where(and(eq(follows.followerId, followerId), eq(follows.followingId, req.params.id)));

    if (existing.length > 0) {
      await db.delete(follows).where(and(eq(follows.followerId, followerId), eq(follows.followingId, req.params.id)));
      await db.update(users).set({ followersCount: sql`GREATEST(${users.followersCount} - 1, 0)` }).where(eq(users.id, req.params.id));
      await db.update(users).set({ followingCount: sql`GREATEST(${users.followingCount} - 1, 0)` }).where(eq(users.id, followerId));
      return res.json({ following: false });
    }

    await db.insert(follows).values({ followerId, followingId: req.params.id });
    await db.update(users).set({ followersCount: sql`${users.followersCount} + 1` }).where(eq(users.id, req.params.id));
    await db.update(users).set({ followingCount: sql`${users.followingCount} + 1` }).where(eq(users.id, followerId));
    res.json({ following: true });

    const [actor] = await db.select({ name: users.name }).from(users).where(eq(users.id, followerId));
    sendPushToUser(req.params.id, {
      type: "follow",
      title: "👤 עוקב חדש",
      body: `${actor?.name ?? "מישהו"} החל לעקוב אחרייך`,
      data: { type: "follow", followerId },
      actorId: followerId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle follow" });
  }
});

router.get("/:id/suggestions", async (req, res) => {
  try {
    const myId = req.params.id;
    const limit = Math.min(parseInt(String(req.query.limit ?? "12")), 30);

    const followingRows = await db.select({ id: follows.followingId }).from(follows).where(eq(follows.followerId, myId));
    const followingIds = followingRows.map((f) => f.id);
    const excludeIds = [...followingIds, myId];

    let fofScore: Record<string, number> = {};
    if (followingIds.length > 0) {
      const fofRows = await db
        .select({ userId: follows.followingId, followedBy: follows.followerId })
        .from(follows)
        .where(and(inArray(follows.followerId, followingIds), not(inArray(follows.followingId, excludeIds))));
      for (const row of fofRows) {
        fofScore[row.userId] = (fofScore[row.userId] ?? 0) + 1;
      }
    }

    const candidates = await db
      .select()
      .from(users)
      .where(not(inArray(users.id, excludeIds)))
      .limit(100);

    const scored = candidates
      .map((u) => ({ ...u, mutualFollowers: fofScore[u.id] ?? 0 }))
      .sort((a, b) => {
        const scoreA = a.mutualFollowers * 20 + (a.followersCount ?? 0) * 0.5 + (a.trustScore ?? 0) * 0.3 + (a.tipsCount ?? 0) * 0.2;
        const scoreB = b.mutualFollowers * 20 + (b.followersCount ?? 0) * 0.5 + (b.trustScore ?? 0) * 0.3 + (b.tipsCount ?? 0) * 0.2;
        return scoreB - scoreA;
      })
      .slice(0, limit);

    res.json(scored);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get suggestions" });
  }
});

router.get("/:id/is-following/:targetId", async (req, res) => {
  try {
    const existing = await db.select().from(follows).where(and(eq(follows.followerId, req.params.id), eq(follows.followingId, req.params.targetId)));
    res.json({ following: existing.length > 0 });
  } catch (err) {
    res.status(500).json({ error: "Failed to check follow" });
  }
});

export default router;
