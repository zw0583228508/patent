import { Router } from "express";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
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
    const { notifComments, notifLikes, notifFollows, notifVotes } = req.body;
    const update: Partial<typeof users.$inferInsert> = {};
    if (notifComments !== undefined) update.notifComments = Boolean(notifComments);
    if (notifLikes !== undefined) update.notifLikes = Boolean(notifLikes);
    if (notifFollows !== undefined) update.notifFollows = Boolean(notifFollows);
    if (notifVotes !== undefined) update.notifVotes = Boolean(notifVotes);

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

router.get("/:id/is-following/:targetId", async (req, res) => {
  try {
    const existing = await db.select().from(follows).where(and(eq(follows.followerId, req.params.id), eq(follows.followingId, req.params.targetId)));
    res.json({ following: existing.length > 0 });
  } catch (err) {
    res.status(500).json({ error: "Failed to check follow" });
  }
});

export default router;
