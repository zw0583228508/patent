import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db, users, notifications } from "../db";
import { logger } from "./logger";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

export type NotifType = "like" | "comment" | "follow" | "vote";
export type PostType = "tip" | "question" | "comment";

export interface PushPayload {
  type: NotifType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  actorId?: string;
  postId?: string;
  postType?: PostType;
}

type UserPrefs = {
  pushToken: string | null;
  notifLikes: boolean | null;
  notifComments: boolean | null;
  notifFollows: boolean | null;
  notifVotes: boolean | null;
  notifCommentsFilter: string | null;
  notifVotesFilter: string | null;
  notifTopicsFilter: string | null;
};

const PREF_KEY: Record<NotifType, keyof UserPrefs> = {
  like: "notifLikes",
  comment: "notifComments",
  follow: "notifFollows",
  vote: "notifVotes",
};

const FILTER_KEY: Record<NotifType, keyof UserPrefs | null> = {
  like: null,
  comment: "notifCommentsFilter",
  follow: null,
  vote: "notifVotesFilter",
};

function passesContentFilter(filter: string | null, postType: PostType | undefined): boolean {
  if (!filter || filter === "all") return true;
  if (!postType) return true;
  return filter === postType;
}

export async function sendPushToUser(userId: string, payload: PushPayload): Promise<void> {
  try {
    const [user] = await db
      .select({
        pushToken: users.pushToken,
        notifLikes: users.notifLikes,
        notifComments: users.notifComments,
        notifFollows: users.notifFollows,
        notifVotes: users.notifVotes,
        notifCommentsFilter: users.notifCommentsFilter,
        notifVotesFilter: users.notifVotesFilter,
        notifTopicsFilter: users.notifTopicsFilter,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) return;

    const prefKey = PREF_KEY[payload.type];
    const prefEnabled = user[prefKey] ?? true;

    await db.insert(notifications).values({
      id: randomUUID(),
      userId,
      type: payload.type,
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
      actorId: payload.actorId ?? null,
      postId: payload.postId ?? null,
    });

    if (!prefEnabled) {
      logger.debug({ userId, type: payload.type }, "Push suppressed by user preference");
      return;
    }

    const filterKey = FILTER_KEY[payload.type];
    if (filterKey) {
      const filter = user[filterKey] as string | null;
      if (!passesContentFilter(filter, payload.postType)) {
        logger.debug({ userId, type: payload.type, filter, postType: payload.postType }, "Push suppressed by content filter");
        return;
      }
    }

    if (!user.pushToken) return;
    await sendRawPush(user.pushToken, payload.title, payload.body, payload.data ?? {});
  } catch (err) {
    logger.warn({ err, userId }, "Failed to send push to user");
  }
}

async function sendRawPush(
  pushToken: string,
  title: string,
  body: string,
  data: Record<string, unknown>,
): Promise<void> {
  if (!pushToken.startsWith("ExponentPushToken[") && !pushToken.startsWith("ExpoPushToken[")) {
    logger.warn({ pushToken }, "Invalid Expo push token format");
    return;
  }

  const res = await fetch(EXPO_PUSH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ to: pushToken, title, body, data, sound: "default", priority: "high", channelId: "default" }),
  });

  if (!res.ok) {
    logger.warn({ status: res.status }, "Push request failed");
    return;
  }

  const json = await res.json();
  const d = json?.data;
  if (d?.status === "error") {
    logger.warn({ message: d.message, error: d.details?.error }, "Expo push error");
    if (d.details?.error === "DeviceNotRegistered") {
      await db.update(users).set({ pushToken: null }).where(eq(users.pushToken, pushToken));
    }
  } else {
    logger.info({ token: pushToken.slice(0, 24) + "…", title }, "Push sent");
  }
}
