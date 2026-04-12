import { Router } from "express";
import { desc, eq, sql } from "drizzle-orm";
import { db, comments, posts, users } from "../db";

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
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { id, postId, authorId, content } = req.body;
    if (!id || !postId || !authorId || !content) return res.status(400).json({ error: "Missing required fields" });

    const [comment] = await db.insert(comments).values({ id, postId, authorId, content }).returning();
    await db.update(posts).set({ commentsCount: sql`${posts.commentsCount} + 1` }).where(eq(posts.id, postId));

    const [author] = await db
      .select({ id: users.id, name: users.name, username: users.username, avatarGradient: users.avatarGradient })
      .from(users)
      .where(eq(users.id, authorId));

    res.status(201).json({ ...comment, author });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    const [comment] = await db.select().from(comments).where(eq(comments.id, req.params.id));
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (comment.authorId !== userId) return res.status(403).json({ error: "Not authorized" });

    await db.delete(comments).where(eq(comments.id, req.params.id));
    await db.update(posts).set({ commentsCount: sql`GREATEST(${posts.commentsCount} - 1, 0)` }).where(eq(posts.id, comment.postId));

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

export default router;
