import { randomUUID } from "node:crypto";
import { Router } from "express";
import { eq, and, sql, desc } from "drizzle-orm";
import { db } from "../db";
import { collections, collectionPosts } from "../db/schema";
import { requireAuth } from "../lib/authMiddleware";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const rows = await db
      .select()
      .from(collections)
      .where(eq(collections.userId, userId))
      .orderBy(desc(collections.createdAt));
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch collections" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const { name, icon = "bookmark", color = "#f0e040" } = req.body as {
      name: string;
      icon?: string;
      color?: string;
    };
    if (!name?.trim()) return res.status(400).json({ error: "Name required" });

    const [row] = await db
      .insert(collections)
      .values({ id: randomUUID(), userId, name: name.trim(), icon, color })
      .returning();
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create collection" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const { name, icon, color } = req.body as {
      name?: string;
      icon?: string;
      color?: string;
    };
    const [row] = await db
      .update(collections)
      .set({
        ...(name != null ? { name: name.trim() } : {}),
        ...(icon != null ? { icon } : {}),
        ...(color != null ? { color } : {}),
      })
      .where(and(eq(collections.id, req.params.id), eq(collections.userId, userId)))
      .returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update collection" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    await db
      .delete(collections)
      .where(and(eq(collections.id, req.params.id), eq(collections.userId, userId)));
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete collection" });
  }
});

router.get("/check/:postId", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const { postId } = req.params;
    const rows = await db
      .select({ collectionId: collectionPosts.collectionId })
      .from(collectionPosts)
      .where(and(eq(collectionPosts.postId, postId), eq(collectionPosts.userId, userId)));
    const ids = rows.map((r) => r.collectionId);
    res.json({ collectionIds: ids });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to check" });
  }
});

router.post("/:id/posts", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const { postId } = req.body as { postId: string };
    if (!postId) return res.status(400).json({ error: "postId required" });

    const col = await db
      .select({ id: collections.id })
      .from(collections)
      .where(and(eq(collections.id, req.params.id), eq(collections.userId, userId)))
      .limit(1);
    if (!col.length) return res.status(404).json({ error: "Collection not found" });

    await db
      .insert(collectionPosts)
      .values({ collectionId: req.params.id, postId, userId })
      .onConflictDoNothing();

    await db
      .update(collections)
      .set({ postsCount: sql`${collections.postsCount} + 1` })
      .where(eq(collections.id, req.params.id));

    res.json({ added: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to add post" });
  }
});

router.delete("/:id/posts/:postId", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    await db
      .delete(collectionPosts)
      .where(
        and(
          eq(collectionPosts.collectionId, req.params.id),
          eq(collectionPosts.postId, req.params.postId),
          eq(collectionPosts.userId, userId),
        ),
      );

    await db
      .update(collections)
      .set({ postsCount: sql`GREATEST(${collections.postsCount} - 1, 0)` })
      .where(eq(collections.id, req.params.id));

    res.json({ removed: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to remove post" });
  }
});

router.get("/:id/posts", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const limit = Math.min(Number(req.query.limit ?? 20), 50);
    const offset = Number(req.query.offset ?? 0);

    const col = await db
      .select()
      .from(collections)
      .where(and(eq(collections.id, req.params.id), eq(collections.userId, userId)))
      .limit(1);
    if (!col.length) return res.status(404).json({ error: "Collection not found" });

    const rows = await db
      .select({
        postId: collectionPosts.postId,
        savedAt: collectionPosts.createdAt,
      })
      .from(collectionPosts)
      .where(
        and(
          eq(collectionPosts.collectionId, req.params.id),
          eq(collectionPosts.userId, userId),
        ),
      )
      .orderBy(desc(collectionPosts.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({ collection: col[0], postIds: rows.map((r) => r.postId), hasMore: rows.length === limit });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch collection posts" });
  }
});

export default router;
