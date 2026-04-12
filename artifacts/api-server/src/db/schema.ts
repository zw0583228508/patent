import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  bio: text("bio").default(""),
  avatarGradient: text("avatar_gradient").default("primary"),
  categoryId: text("category_id").default("general"),
  trustScore: integer("trust_score").default(0),
  tipsCount: integer("tips_count").default(0),
  followersCount: integer("followers_count").default(0),
  followingCount: integer("following_count").default(0),
  pushToken: text("push_token"),
  pushTokenUpdatedAt: timestamp("push_token_updated_at", { withTimezone: true }),
  notifComments: boolean("notif_comments").default(true),
  notifLikes: boolean("notif_likes").default(true),
  notifFollows: boolean("notif_follows").default(true),
  notifVotes: boolean("notif_votes").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const posts = pgTable(
  "posts",
  {
    id: text("id").primaryKey(),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    title: text("title").notNull(),
    content: text("content").default(""),
    categoryId: text("category_id").notNull().default("general"),
    images: text("images").array().default([]),
    tags: text("tags").array().default([]),
    likesCount: integer("likes_count").default(0),
    savesCount: integer("saves_count").default(0),
    sharesCount: integer("shares_count").default(0),
    repostsCount: integer("reposts_count").default(0),
    commentsCount: integer("comments_count").default(0),
    upvotesCount: integer("upvotes_count").default(0),
    downvotesCount: integer("downvotes_count").default(0),
    answersCount: integer("answers_count").default(0),
    isAnswered: boolean("is_answered").default(false),
    isTrending: boolean("is_trending").default(false),
    isFeatured: boolean("is_featured").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [
    index("idx_posts_author_id").on(t.authorId),
    index("idx_posts_created_at").on(t.createdAt),
    index("idx_posts_category").on(t.categoryId),
    index("idx_posts_type").on(t.type),
  ],
);

export const postLikes = pgTable(
  "post_likes",
  {
    postId: text("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.postId, t.userId] })],
);

export const postSaves = pgTable(
  "post_saves",
  {
    postId: text("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.postId, t.userId] })],
);

export const postVotes = pgTable(
  "post_votes",
  {
    postId: text("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    vote: integer("vote").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.postId, t.userId] })],
);

export const comments = pgTable(
  "comments",
  {
    id: text("id").primaryKey(),
    postId: text("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    authorId: text("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    likesCount: integer("likes_count").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("idx_comments_post_id").on(t.postId)],
);

export const postReposts = pgTable(
  "post_reposts",
  {
    postId: text("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.postId, t.userId] })],
);

export const follows = pgTable(
  "follows",
  {
    followerId: text("follower_id").notNull(),
    followingId: text("following_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.followerId, t.followingId] }),
    index("idx_follows_follower").on(t.followerId),
    index("idx_follows_following").on(t.followingId),
  ],
);

export const notifications = pgTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    data: jsonb("data").default({}),
    isRead: boolean("is_read").default(false),
    actorId: text("actor_id"),
    postId: text("post_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("idx_notifications_user_id").on(t.userId, t.createdAt)],
);
