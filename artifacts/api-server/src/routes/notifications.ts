import { Router } from "express";
import { and, desc, eq, sql } from "drizzle-orm";
import { db, notifications, users } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { userId, limit = "30", offset = "0" } = req.query as Record<string, string>;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const list = await db
      .select({
        notif: notifications,
        actor: {
          id: users.id,
          name: users.name,
          username: users.username,
          avatarGradient: users.avatarGradient,
        },
      })
      .from(notifications)
      .leftJoin(users, eq(notifications.actorId, users.id))
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    const unreadCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

    res.json({
      data: list.map(({ notif, actor }) => ({ ...notif, actor })),
      unreadCount: Number(unreadCount[0]?.count ?? 0),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.post("/:id/read", async (req, res) => {
  try {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, req.params.id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

router.post("/read-all", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });
    await db.update(notifications).set({ isRead: true }).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});

export default router;
