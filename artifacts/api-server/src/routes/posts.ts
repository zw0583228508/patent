import { Router } from "express";
import { and, desc, eq, inArray, ilike, or, sql } from "drizzle-orm";
import { db, posts, postLikes, postSaves, postVotes, postReposts, users } from "../db";
import { requireAuth } from "../lib/authMiddleware";
import { sendPushToUser } from "../lib/pushNotifications";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category, type, search, limit = "20", offset = "0", userId } = req.query as Record<string, string>;
    const lim = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const off = Math.max(parseInt(offset) || 0, 0);

    const conditions: ReturnType<typeof eq>[] = [];
    if (category && category !== "all") conditions.push(eq(posts.categoryId, category));
    if (type && type !== "all") conditions.push(eq(posts.type, type));

    const whereClause = search
      ? and(...conditions, or(ilike(posts.title, `%${search}%`), ilike(posts.content, `%${search}%`)))
      : conditions.length > 0
      ? and(...conditions)
      : undefined;

    const [results, countResult] = await Promise.all([
      db
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
        .where(whereClause)
        .orderBy(desc(posts.createdAt))
        .limit(lim)
        .offset(off),
      db.select({ count: sql<number>`count(*)` }).from(posts).where(whereClause),
    ]);

    let likedIds: Set<string> = new Set();
    let savedIds: Set<string> = new Set();
    let votedMap: Map<string, number> = new Map();

    if (userId && results.length > 0) {
      const postIds = results.map((r) => r.post.id);
      const [liked, saved, voted] = await Promise.all([
        db.select({ postId: postLikes.postId }).from(postLikes)
          .where(and(eq(postLikes.userId, userId), inArray(postLikes.postId, postIds))),
        db.select({ postId: postSaves.postId }).from(postSaves)
          .where(and(eq(postSaves.userId, userId), inArray(postSaves.postId, postIds))),
        db.select({ postId: postVotes.postId, vote: postVotes.vote }).from(postVotes)
          .where(and(eq(postVotes.userId, userId), inArray(postVotes.postId, postIds))),
      ]);
      likedIds = new Set(liked.map((l) => l.postId));
      savedIds = new Set(saved.map((s) => s.postId));
      voted.forEach((v) => votedMap.set(v.postId, v.vote));
    }

    const total = Number(countResult[0].count);
    const data = results.map(({ post, author }) => ({
      ...post,
      author,
      isLiked: likedIds.has(post.id),
      isSaved: savedIds.has(post.id),
      userVote: votedMap.get(post.id) ?? 0,
    }));

    res.json({ data, total, hasMore: off + lim < total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [result] = await db
      .select({
        post: posts,
        author: {
          id: users.id, name: users.name, username: users.username,
          avatarGradient: users.avatarGradient, trustScore: users.trustScore,
        },
      })
      .from(posts).innerJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, req.params.id));

    if (!result) return res.status(404).json({ error: "Post not found" });
    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const { id, type, title, content, categoryId, images, tags } = req.body;
    if (!id || !type || !title) return res.status(400).json({ error: "Missing required fields" });

    const [post] = await db.transaction(async (tx) => {
      const [p] = await tx.insert(posts).values({ id, authorId: userId, type, title, content, categoryId, images, tags }).returning();
      await tx.update(users).set({ tipsCount: sql`${users.tipsCount} + 1` }).where(eq(users.id, userId));
      return [p];
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const [post] = await db.select().from(posts).where(eq(posts.id, req.params.id));
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.authorId !== userId) return res.status(403).json({ error: "Not authorized" });

    await db.transaction(async (tx) => {
      await tx.delete(posts).where(eq(posts.id, req.params.id));
      await tx.update(users).set({ tipsCount: sql`GREATEST(${users.tipsCount} - 1, 0)` }).where(eq(users.id, userId));
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

router.post("/:id/like", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const postId = req.params.id;

    const existing = await db.select().from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));

    if (existing.length > 0) {
      await db.transaction(async (tx) => {
        await tx.delete(postLikes).where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
        await tx.update(posts).set({ likesCount: sql`GREATEST(${posts.likesCount} - 1, 0)` }).where(eq(posts.id, postId));
      });
      return res.json({ liked: false });
    }

    await db.transaction(async (tx) => {
      await tx.insert(postLikes).values({ postId, userId });
      await tx.update(posts).set({ likesCount: sql`${posts.likesCount} + 1` }).where(eq(posts.id, postId));
    });

    res.json({ liked: true });

    Promise.all([
      db.select({ authorId: posts.authorId, title: posts.title, type: posts.type }).from(posts).where(eq(posts.id, postId)),
      db.select({ name: users.name }).from(users).where(eq(users.id, userId)),
    ]).then(([[post], [actor]]) => {
      if (post && post.authorId !== userId) {
        sendPushToUser(post.authorId, {
          type: "like",
          title: "❤️ לייק חדש",
          body: `${actor?.name ?? "מישהו"} אהב את הפוסט שלך: "${post.title.slice(0, 60)}"`,
          data: { type: "like", postId },
          actorId: userId,
          postId,
          postType: post.type === "question" ? "question" : "tip",
        });
      }
    }).catch(() => {});
  } catch {
    res.status(500).json({ error: "Failed to toggle like" });
  }
});

router.post("/:id/save", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const postId = req.params.id;

    const existing = await db.select().from(postSaves)
      .where(and(eq(postSaves.postId, postId), eq(postSaves.userId, userId)));

    if (existing.length > 0) {
      await db.transaction(async (tx) => {
        await tx.delete(postSaves).where(and(eq(postSaves.postId, postId), eq(postSaves.userId, userId)));
        await tx.update(posts).set({ savesCount: sql`GREATEST(${posts.savesCount} - 1, 0)` }).where(eq(posts.id, postId));
      });
      return res.json({ saved: false });
    }

    await db.transaction(async (tx) => {
      await tx.insert(postSaves).values({ postId, userId });
      await tx.update(posts).set({ savesCount: sql`${posts.savesCount} + 1` }).where(eq(posts.id, postId));
    });

    res.json({ saved: true });
  } catch {
    res.status(500).json({ error: "Failed to toggle save" });
  }
});

router.post("/:id/vote", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const postId = req.params.id;
    const { vote } = req.body;
    if (![-1, 1].includes(vote)) return res.status(400).json({ error: "vote must be 1 or -1" });

    const existing = await db.select().from(postVotes)
      .where(and(eq(postVotes.postId, postId), eq(postVotes.userId, userId)));

    if (existing.length > 0) {
      if (existing[0].vote === vote) {
        await db.transaction(async (tx) => {
          await tx.delete(postVotes).where(and(eq(postVotes.postId, postId), eq(postVotes.userId, userId)));
          if (vote === 1) await tx.update(posts).set({ upvotesCount: sql`GREATEST(${posts.upvotesCount} - 1, 0)` }).where(eq(posts.id, postId));
          else await tx.update(posts).set({ downvotesCount: sql`GREATEST(${posts.downvotesCount} - 1, 0)` }).where(eq(posts.id, postId));
        });
        return res.json({ vote: 0 });
      }
      await db.update(postVotes).set({ vote }).where(and(eq(postVotes.postId, postId), eq(postVotes.userId, userId)));
    } else {
      await db.insert(postVotes).values({ postId, userId, vote });
    }

    const prevVote = existing[0]?.vote ?? 0;
    await db.transaction(async (tx) => {
      if (vote === 1) {
        await tx.update(posts).set({
          upvotesCount: sql`${posts.upvotesCount} + 1`,
          downvotesCount: prevVote === -1 ? sql`GREATEST(${posts.downvotesCount} - 1, 0)` : posts.downvotesCount,
        }).where(eq(posts.id, postId));
      } else {
        await tx.update(posts).set({
          downvotesCount: sql`${posts.downvotesCount} + 1`,
          upvotesCount: prevVote === 1 ? sql`GREATEST(${posts.upvotesCount} - 1, 0)` : posts.upvotesCount,
        }).where(eq(posts.id, postId));
      }
    });

    res.json({ vote });

    if (vote === 1) {
      Promise.all([
        db.select({ authorId: posts.authorId, title: posts.title, type: posts.type }).from(posts).where(eq(posts.id, postId)),
        db.select({ name: users.name }).from(users).where(eq(users.id, userId)),
      ]).then(([[post], [actor]]) => {
        if (post && post.authorId !== userId) {
          sendPushToUser(post.authorId, {
            type: "vote",
            title: "👍 הצבעה חיובית",
            body: `${actor?.name ?? "מישהו"} הצביע בעד הפוסט שלך: "${post.title.slice(0, 60)}"`,
            data: { type: "vote", postId, vote: 1 },
            actorId: userId,
            postId,
            postType: post.type === "question" ? "question" : "tip",
          });
        }
      }).catch(() => {});
    }
  } catch {
    res.status(500).json({ error: "Failed to vote" });
  }
});

router.post("/:id/share", async (req, res) => {
  try {
    await db.update(posts).set({ sharesCount: sql`${posts.sharesCount} + 1` }).where(eq(posts.id, req.params.id));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to record share" });
  }
});

router.post("/:id/repost", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const postId = req.params.id;

    const existing = await db.select().from(postReposts)
      .where(and(eq(postReposts.postId, postId), eq(postReposts.userId, userId)));

    if (existing.length > 0) {
      await db.transaction(async (tx) => {
        await tx.delete(postReposts).where(and(eq(postReposts.postId, postId), eq(postReposts.userId, userId)));
        await tx.update(posts).set({ repostsCount: sql`GREATEST(${posts.repostsCount} - 1, 0)` }).where(eq(posts.id, postId));
      });
      return res.json({ reposted: false });
    }

    await db.transaction(async (tx) => {
      await tx.insert(postReposts).values({ postId, userId });
      await tx.update(posts).set({ repostsCount: sql`${posts.repostsCount} + 1` }).where(eq(posts.id, postId));
    });

    res.json({ reposted: true });

    Promise.all([
      db.select({ authorId: posts.authorId, title: posts.title }).from(posts).where(eq(posts.id, postId)),
      db.select({ name: users.name }).from(users).where(eq(users.id, userId)),
    ]).then(([[post], [actor]]) => {
      if (post && post.authorId !== userId) {
        sendPushToUser(post.authorId, {
          type: "repost",
          title: "פורסם מחדש",
          body: `${actor?.name ?? "מישהו"} פרסם מחדש את הפוסט שלך: "${post.title.slice(0, 60)}"`,
          data: { type: "repost", postId },
          actorId: userId,
          postId,
        });
      }
    }).catch(() => {});
  } catch {
    res.status(500).json({ error: "Failed to toggle repost" });
  }
});

export default router;
