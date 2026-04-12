import { Router } from "express";
import { desc, eq, sql } from "drizzle-orm";
import { db, comments, posts, users } from "../db";
import { requireAuth } from "../lib/authMiddleware";
import { sendPushToUser } from "../lib/pushNotifications";

const router = Router();

router.get("/post/:postId", async (req, res) => {
  try {
    const { limit = "30", offset = "0" } = req.query as Record<string, string>;
    const list = await db
      .select({
        comment: comments,
        author: { id: users.id, name: users.name, username: users.username, avatarGradient: users.avatarGradient },
      })
      .from(comments)
      .innerJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.postId, req.params.postId))
      .orderBy(desc(comments.createdAt))
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    res.json(list.map(({ comment, author }) => ({ ...comment, author })));
  } catch {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const authorId = (req as any).userId as string;
    const { id, postId, content } = req.body;
    if (!id || !postId || !content) return res.status(400).json({ error: "Missing required fields" });

    const [comment] = await db.transaction(async (tx) => {
      const [c] = await tx.insert(comments).values({ id, postId, authorId, content }).returning();
      await tx.update(posts).set({ commentsCount: sql`${posts.commentsCount} + 1` }).where(eq(posts.id, postId));
      return [c];
    });

    const [author] = await db
      .select({ id: users.id, name: users.name, username: users.username, avatarGradient: users.avatarGradient })
      .from(users)
      .where(eq(users.id, authorId));

    res.status(201).json({ ...comment, author });

    Promise.all([
      db.select({ authorId: posts.authorId, title: posts.title, type: posts.type }).from(posts).where(eq(posts.id, postId)),
    ]).then(([[post]]) => {
      if (post && post.authorId !== authorId) {
        sendPushToUser(post.authorId, {
          type: "comment",
          title: "💬 תגובה חדשה",
          body: `${author?.name ?? "מישהו"} הגיב על הפוסט שלך: "${content.slice(0, 80)}"`,
          data: { type: "comment", postId, commentId: id },
          actorId: authorId,
          postId,
          postType: post.type === "question" ? "question" : "tip",
        });
      }
    }).catch(() => {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const [comment] = await db.select().from(comments).where(eq(comments.id, req.params.id));
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (comment.authorId !== userId) return res.status(403).json({ error: "Not authorized" });

    await db.transaction(async (tx) => {
      await tx.delete(comments).where(eq(comments.id, req.params.id));
      await tx.update(posts).set({ commentsCount: sql`GREATEST(${posts.commentsCount} - 1, 0)` }).where(eq(posts.id, comment.postId));
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

export default router;
