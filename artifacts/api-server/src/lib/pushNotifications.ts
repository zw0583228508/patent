import { eq } from "drizzle-orm";
import { db, users } from "../db";
import { logger } from "./logger";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

export interface PushMessage {
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: "default" | null;
  badge?: number;
}

export async function sendPushToUser(userId: string, message: PushMessage): Promise<void> {
  try {
    const [user] = await db.select({ pushToken: users.pushToken }).from(users).where(eq(users.id, userId));
    if (!user?.pushToken) return;
    await sendPushNotification(user.pushToken, message);
  } catch (err) {
    logger.warn({ err, userId }, "Failed to send push to user");
  }
}

export async function sendPushToUsers(userIds: string[], message: PushMessage): Promise<void> {
  if (userIds.length === 0) return;
  try {
    const rows = await db.select({ id: users.id, pushToken: users.pushToken }).from(users);
    const tokens = rows
      .filter((r) => userIds.includes(r.id) && r.pushToken)
      .map((r) => r.pushToken!);
    if (tokens.length === 0) return;
    await Promise.allSettled(tokens.map((token) => sendPushNotification(token, message)));
  } catch (err) {
    logger.warn({ err }, "Failed to send push to users");
  }
}

async function sendPushNotification(pushToken: string, message: PushMessage): Promise<void> {
  if (!pushToken.startsWith("ExponentPushToken[") && !pushToken.startsWith("ExpoPushToken[")) {
    logger.warn({ pushToken }, "Invalid Expo push token format, skipping");
    return;
  }

  const payload = {
    to: pushToken,
    title: message.title,
    body: message.body,
    data: message.data ?? {},
    sound: message.sound ?? "default",
    badge: message.badge,
    priority: "high",
    channelId: "default",
  };

  const res = await fetch(EXPO_PUSH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    logger.warn({ status: res.status, text, pushToken }, "Push notification request failed");
    return;
  }

  const json = await res.json();
  const data = json?.data;
  if (data?.status === "error") {
    logger.warn({ details: data.details, message: data.message }, "Push notification error from Expo");
    if (data.details?.error === "DeviceNotRegistered") {
      await db.update(users).set({ pushToken: null }).where(eq(users.pushToken, pushToken));
      logger.info({ pushToken }, "Removed unregistered push token");
    }
  } else {
    logger.info({ pushToken: pushToken.slice(0, 20) + "…", title: message.title }, "Push notification sent");
  }
}
