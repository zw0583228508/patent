import { Router } from "express";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db, posts, postLikes, postSaves, postVotes, users } from "../db";
import { sendPushToUser } from "../lib/pushNotifications";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category, type, search, limit = "20", offset = "0", userId } = req.query as Record<string, string>;

    let conditions: ReturnType<typeof eq>[] = [];
    if (category && category !== "all") conditions.push(eq(posts.categoryId, category));
    if (type && type !== "all") conditions.push(eq(posts.type, type));

    const query = db
      .select({
        post: posts,
        author: {
          id: users.id,
          name: users.name,
          username: users.username,
          avatarGradient: users.avatarGradient,
          trustScore: users.trustScore,
        },
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(
        search
          ? and(...conditions, or(ilike(posts.title, `%${search}%`), ilike(posts.content, `%${search}%`)))
          : conditions.length > 0
          ? and(...conditions)
          : undefined,
      )
      .orderBy(desc(posts.createdAt))
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    const results = await query;

    let likedIds: Set<string> = new Set();
    let savedIds: Set<string> = new Set();
    let votedMap: Map<string, number> = new Map();

    if (userId) {
      const liked = await db.select({ postId: postLikes.postId }).from(postLikes).where(eq(postLikes.userId, userId));
      likedIds = new Set(liked.map((l) => l.postId));

      const saved = await db.select({ postId: postSaves.postId }).from(postSaves).where(eq(postSaves.userId, userId));
      savedIds = new Set(saved.map((s) => s.postId));

      const voted = await db.select({ postId: postVotes.postId, vote: postVotes.vote }).from(postVotes).where(eq(postVotes.userId, userId));
      voted.forEach((v) => votedMap.set(v.postId, v.vote));
    }

    const data = results.map(({ post, author }) => ({
      ...post, author,
      isLiked: likedIds.has(post.id),
      isSaved: savedIds.has(post.id),
      userVote: votedMap.get(post.id) ?? 0,
    }));

    const total = await db.select({ count: sql<number>`count(*)` }).from(posts);
    res.json({ data, total: Number(total[0].count), hasMore: parseInt(offset) + parseInt(limit) < Number(total[0].count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [result] = await db
      .select({ post: posts, author: { id: users.id, name: users.name, username: users.username, avatarGradient: users.avatarGradient, trustScore: users.trustScore } })
      .from(posts).innerJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, req.params.id));

    if (!result) return res.status(404).json({ error: "Post not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { id, authorId, type, title, content, categoryId, images, tags } = req.body;
    if (!id || !authorId || !type || !title) return res.status(400).json({ error: "Missing required fields" });

    const [post] = await db.insert(posts).values({ id, authorId, type, title, content, categoryId, images, tags }).returning();
    await db.update(users).set({ tipsCount: sql`${users.tipsCount} + 1` }).where(eq(users.id, authorId));

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    const [post] = await db.select().from(posts).where(eq(posts.id, req.params.id));
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.authorId !== userId) return res.status(403).json({ error: "Not authorized" });

    await db.delete(posts).where(eq(posts.id, req.params.id));
    await db.update(users).set({ tipsCount: sql`GREATEST(${users.tipsCount} - 1, 0)` }).where(eq(users.id, userId));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

router.post("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const existing = await db.select().from(postLikes).where(and(eq(postLikes.postId, req.params.id), eq(postLikes.userId, userId)));

    if (existing.length > 0) {
      await db.delete(postLikes).where(and(eq(postLikes.postId, req.params.id), eq(postLikes.userId, userId)));
      await db.update(posts).set({ likesCount: sql`GREATEST(${posts.likesCount} - 1, 0)` }).where(eq(posts.id, req.params.id));
      return res.json({ liked: false });
    }

    await db.insert(postLikes).values({ postId: req.params.id, userId });
    await db.update(posts).set({ likesCount: sql`${posts.likesCount} + 1` }).where(eq(posts.id, req.params.id));
    res.json({ liked: true });

    const [post] = await db.select({ authorId: posts.authorId, title: posts.title }).from(posts).where(eq(posts.id, req.params.id));
    const [actor] = await db.select({ name: users.name }).from(users).where(eq(users.id, userId));
    if (post && post.authorId !== userId) {
      sendPushToUser(post.authorId, {
        title: "❤️ לייק חדש",
        body: `${actor?.name ?? "מישהו"} אהב את הפוסט שלך: "${post.title.slice(0, 60)}"`,
        data: { type: "like", postId: req.params.id },
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle like" });
  }
});

router.post("/:id/save", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const existing = await db.select().from(postSaves).where(and(eq(postSaves.postId, req.params.id), eq(postSaves.userId, userId)));

    if (existing.length > 0) {
      await db.delete(postSaves).where(and(eq(postSaves.postId, req.params.id), eq(postSaves.userId, userId)));
      await db.update(posts).set({ savesCount: sql`GREATEST(${posts.savesCount} - 1, 0)` }).where(eq(posts.id, req.params.id));
      return res.json({ saved: false });
    }

    await db.insert(postSaves).values({ postId: req.params.id, userId });
    await db.update(posts).set({ savesCount: sql`${posts.savesCount} + 1` }).where(eq(posts.id, req.params.id));
    res.json({ saved: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle save" });
  }
});

router.post("/:id/vote", async (req, res) => {
  try {
    const { userId, vote } = req.body;
    if (!userId || ![-1, 1].includes(vote)) return res.status(400).json({ error: "userId and vote (1 or -1) required" });

    const existing = await db.select().from(postVotes).where(and(eq(postVotes.postId, req.params.id), eq(postVotes.userId, userId)));

    if (existing.length > 0) {
      if (existing[0].vote === vote) {
        await db.delete(postVotes).where(and(eq(postVotes.postId, req.params.id), eq(postVotes.userId, userId)));
        if (vote === 1) await db.update(posts).set({ upvotesCount: sql`GREATEST(${posts.upvotesCount} - 1, 0)` }).where(eq(posts.id, req.params.id));
        else await db.update(posts).set({ downvotesCount: sql`GREATEST(${posts.downvotesCount} - 1, 0)` }).where(eq(posts.id, req.params.id));
        return res.json({ vote: 0 });
      }
      await db.update(postVotes).set({ vote }).where(and(eq(postVotes.postId, req.params.id), eq(postVotes.userId, userId)));
    } else {
      await db.insert(postVotes).values({ postId: req.params.id, userId, vote });
    }

    const prevVote = existing[0]?.vote ?? 0;
    if (vote === 1) {
      await db.update(posts).set({
        upvotesCount: sql`${posts.upvotesCount} + 1`,
        downvotesCount: prevVote === -1 ? sql`GREATEST(${posts.downvotesCount} - 1, 0)` : posts.downvotesCount,
      }).where(eq(posts.id, req.params.id));
    } else {
      await db.update(posts).set({
        downvotesCount: sql`${posts.downvotesCount} + 1`,
        upvotesCount: prevVote === 1 ? sql`GREATEST(${posts.upvotesCount} - 1, 0)` : posts.upvotesCount,
      }).where(eq(posts.id, req.params.id));
    }

    res.json({ vote });

    if (vote === 1) {
      const [post] = await db.select({ authorId: posts.authorId, title: posts.title }).from(posts).where(eq(posts.id, req.params.id));
      const [actor] = await db.select({ name: users.name }).from(users).where(eq(users.id, userId));
      if (post && post.authorId !== userId) {
        sendPushToUser(post.authorId, {
          title: "👍 הצבעה חיובית",
          body: `${actor?.name ?? "מישהו"} הצביע בעד הפוסט שלך: "${post.title.slice(0, 60)}"`,
          data: { type: "vote", postId: req.params.id, vote: 1 },
        });
      }
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to vote" });
  }
});

router.post("/:id/share", async (req, res) => {
  try {
    await db.update(posts).set({ sharesCount: sql`${posts.sharesCount} + 1` }).where(eq(posts.id, req.params.id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to record share" });
  }
});

export default router;
