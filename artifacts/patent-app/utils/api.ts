import { Platform } from "react-native";

function getBaseUrl() {
  if (Platform.OS === "web") {
    return "/api-server/api";
  }
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}/api-server/api`;
  return "http://localhost:8080/api";
}

const BASE_URL = getBaseUrl();

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(err.error ?? `Request failed: ${response.status}`);
  }

  return response.json();
}

export const api = {
  posts: {
    list: (params: { category?: string; type?: string; search?: string; limit?: number; offset?: number; userId?: string }) => {
      const query = new URLSearchParams();
      if (params.category) query.set("category", params.category);
      if (params.type) query.set("type", params.type);
      if (params.search) query.set("search", params.search);
      if (params.limit != null) query.set("limit", String(params.limit));
      if (params.offset != null) query.set("offset", String(params.offset));
      if (params.userId) query.set("userId", params.userId);
      return request<{ data: ApiPost[]; total: number; hasMore: boolean }>(`/posts?${query}`);
    },
    get: (id: string) => request<{ post: ApiPost; author: ApiUserPublic }>(`/posts/${id}`),
    create: (body: CreatePostBody) =>
      request<ApiPost>("/posts", { method: "POST", body: JSON.stringify(body) }),
    delete: (id: string, userId: string) =>
      request<{ success: boolean }>(`/posts/${id}`, { method: "DELETE", body: JSON.stringify({ userId }) }),
    like: (id: string, userId: string) =>
      request<{ liked: boolean }>(`/posts/${id}/like`, { method: "POST", body: JSON.stringify({ userId }) }),
    save: (id: string, userId: string) =>
      request<{ saved: boolean }>(`/posts/${id}/save`, { method: "POST", body: JSON.stringify({ userId }) }),
    vote: (id: string, userId: string, vote: 1 | -1) =>
      request<{ vote: number }>(`/posts/${id}/vote`, { method: "POST", body: JSON.stringify({ userId, vote }) }),
    share: (id: string) =>
      request<{ success: boolean }>(`/posts/${id}/share`, { method: "POST", body: "{}" }),
  },

  users: {
    list: (params: { search?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams();
      if (params.search) query.set("search", params.search);
      if (params.limit != null) query.set("limit", String(params.limit));
      if (params.offset != null) query.set("offset", String(params.offset));
      return request<ApiUser[]>(`/users?${query}`);
    },
    get: (id: string) => request<ApiUser>(`/users/${id}`),
    upsert: (body: UpsertUserBody) =>
      request<ApiUser>("/users/upsert", { method: "POST", body: JSON.stringify(body) }),
    getPosts: (id: string, params?: { limit?: number; offset?: number }) => {
      const query = new URLSearchParams();
      if (params?.limit != null) query.set("limit", String(params.limit));
      if (params?.offset != null) query.set("offset", String(params.offset));
      return request<ApiPost[]>(`/users/${id}/posts?${query}`);
    },
    follow: (id: string, followerId: string) =>
      request<{ following: boolean }>(`/users/${id}/follow`, { method: "POST", body: JSON.stringify({ followerId }) }),
    isFollowing: (id: string, targetId: string) =>
      request<{ following: boolean }>(`/users/${id}/is-following/${targetId}`),
    getFollowers: (id: string) => request<ApiUser[]>(`/users/${id}/followers`),
    getFollowing: (id: string) => request<ApiUser[]>(`/users/${id}/following`),
    savePushToken: (id: string, token: string) =>
      request<{ success: boolean }>(`/users/${id}/push-token`, { method: "POST", body: JSON.stringify({ token }) }),
  },

  comments: {
    list: (postId: string, params?: { limit?: number; offset?: number }) => {
      const query = new URLSearchParams();
      if (params?.limit != null) query.set("limit", String(params.limit));
      if (params?.offset != null) query.set("offset", String(params.offset));
      return request<ApiComment[]>(`/comments/post/${postId}?${query}`);
    },
    create: (body: CreateCommentBody) =>
      request<ApiComment>("/comments", { method: "POST", body: JSON.stringify(body) }),
    delete: (id: string, userId: string) =>
      request<{ success: boolean }>(`/comments/${id}`, { method: "DELETE", body: JSON.stringify({ userId }) }),
  },
};

export interface ApiUserPublic {
  id: string;
  name: string;
  username: string;
  avatarGradient: string;
  trustScore: number;
}

export interface ApiUser extends ApiUserPublic {
  bio: string;
  categoryId: string;
  tipsCount: number;
  followersCount: number;
  followingCount: number;
  createdAt: string;
}

export interface ApiPost {
  id: string;
  authorId: string;
  type: "tip" | "question";
  title: string;
  content: string;
  categoryId: string;
  images: string[];
  tags: string[];
  likesCount: number;
  savesCount: number;
  sharesCount: number;
  commentsCount: number;
  upvotesCount: number;
  downvotesCount: number;
  answersCount: number;
  isAnswered: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  createdAt: string;
  author?: ApiUserPublic;
  isLiked?: boolean;
  isSaved?: boolean;
  userVote?: number;
}

export interface ApiComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  likesCount: number;
  createdAt: string;
  author?: ApiUserPublic;
}

export interface CreatePostBody {
  id: string;
  authorId: string;
  type: "tip" | "question";
  title: string;
  content?: string;
  categoryId: string;
  images?: string[];
  tags?: string[];
}

export interface CreateCommentBody {
  id: string;
  postId: string;
  authorId: string;
  content: string;
}

export interface UpsertUserBody {
  id: string;
  name: string;
  username: string;
  bio?: string;
  avatarGradient?: string;
  categoryId?: string;
}
