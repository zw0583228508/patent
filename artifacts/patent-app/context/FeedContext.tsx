import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { Comment, COMMENTS_MAP, FEED_ITEMS, FeedItem, Question, Tip } from "@/data/mockData";

const PAGE_SIZE = 15;

type VoteMap = Record<string, "worked" | "didnt" | null>;
type LikeSet = Set<string>;
type CommentsMap = Record<string, Comment[]>;

type FeedContextType = {
  items: FeedItem[];
  votes: VoteMap;
  savedIds: Set<string>;
  likedIds: LikeSet;
  comments: CommentsMap;
  vote: (id: string, vote: "worked" | "didnt") => void;
  toggleSave: (id: string) => void;
  toggleLike: (id: string) => void;
  addComment: (itemId: string, text: string) => void;
  addPost: (type: "tip" | "question", text: string, categoryId: string) => FeedItem;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  visibleCount: number;
  loadMore: () => void;
  hasMore: (total: number) => boolean;
  resetPagination: () => void;
};

const FeedContext = createContext<FeedContextType | null>(null);

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  home:     { label: "בית",       icon: "home" },
  food:     { label: "אוכל",      icon: "coffee" },
  business: { label: "עסקים",     icon: "briefcase" },
  health:   { label: "בריאות",    icon: "heart" },
  tech:     { label: "טכנולוגיה", icon: "cpu" },
  nature:   { label: "טבע",       icon: "sun" },
};

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [votes, setVotes] = useState<VoteMap>({});
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [likedIds, setLikedIds] = useState<LikeSet>(new Set());
  const [comments, setComments] = useState<CommentsMap>(COMMENTS_MAP);
  const [activeCategory, setActiveCategoryState] = useState("all");
  const [userPosts, setUserPosts] = useState<FeedItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    AsyncStorage.getItem("patent_votes").then((v) => {
      if (v) setVotes(JSON.parse(v));
    });
    AsyncStorage.getItem("patent_saved").then((v) => {
      if (v) setSavedIds(new Set(JSON.parse(v)));
    });
    AsyncStorage.getItem("patent_liked").then((v) => {
      if (v) setLikedIds(new Set(JSON.parse(v)));
    });
    AsyncStorage.getItem("patent_comments").then((v) => {
      if (v) setComments({ ...COMMENTS_MAP, ...JSON.parse(v) });
    });
    AsyncStorage.getItem("patent_user_posts").then((v) => {
      if (v) setUserPosts(JSON.parse(v));
    });
  }, []);

  function vote(id: string, v: "worked" | "didnt") {
    setVotes((prev) => {
      const next = { ...prev, [id]: prev[id] === v ? null : v };
      AsyncStorage.setItem("patent_votes", JSON.stringify(next));
      return next;
    });
  }

  function toggleSave(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      AsyncStorage.setItem("patent_saved", JSON.stringify([...next]));
      return next;
    });
  }

  function toggleLike(id: string) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      AsyncStorage.setItem("patent_liked", JSON.stringify([...next]));
      return next;
    });
  }

  function addComment(itemId: string, text: string) {
    const newComment: Comment = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
      author: "יובל כהן",
      initials: "יכ",
      avatarColor: "#f0e040",
      text,
      timestamp: "עכשיו",
      likeCount: 0,
    };
    setComments((prev) => {
      const next = { ...prev, [itemId]: [newComment, ...(prev[itemId] ?? [])] };
      AsyncStorage.setItem("patent_comments", JSON.stringify(next));
      return next;
    });
  }

  function addPost(type: "tip" | "question", text: string, categoryId: string) {
    const id = "post_" + Date.now() + Math.random().toString(36).substr(2, 6);
    const cat = CATEGORY_META[categoryId] ?? { label: "בית", icon: "home" };

    let newItem: FeedItem;
    if (type === "tip") {
      newItem = {
        id, type: "tip", userId: "me",
        author: "יובל כהן", initials: "יכ",
        avatarGradient: ["#f0e040", "#40e0f0"] as const,
        category: cat.label, categoryIcon: cat.icon, categoryId,
        text,
        workedCount: 0, didntWorkCount: 0, commentCount: 0, likeCount: 0,
        trustScore: 96, timestamp: "עכשיו",
      } as Tip;
    } else {
      newItem = {
        id, type: "question", userId: "me",
        author: "יובל כהן", initials: "יכ",
        avatarGradient: ["#f0e040", "#40e0f0"] as const,
        category: cat.label, categoryIcon: cat.icon, categoryId,
        text, answerCount: 0, likeCount: 0, timestamp: "עכשיו",
      } as Question;
    }

    setUserPosts((prev) => {
      const next = [newItem, ...prev];
      AsyncStorage.setItem("patent_user_posts", JSON.stringify(next));
      return next;
    });
    setVisibleCount((c) => c + 1);
    return newItem;
  }

  const setActiveCategory = useCallback((cat: string) => {
    setActiveCategoryState(cat);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const loadMore = useCallback(() => {
    setVisibleCount((c) => c + PAGE_SIZE);
  }, []);

  const resetPagination = useCallback(() => {
    setVisibleCount(PAGE_SIZE);
  }, []);

  const hasMore = useCallback((total: number) => visibleCount < total, [visibleCount]);

  const allItems: FeedItem[] = [...userPosts, ...FEED_ITEMS];

  const items =
    activeCategory === "all"
      ? allItems
      : allItems.filter((item) => item.categoryId === activeCategory);

  return (
    <FeedContext.Provider
      value={{
        items,
        votes,
        savedIds,
        likedIds,
        comments,
        vote,
        toggleSave,
        toggleLike,
        addComment,
        addPost,
        activeCategory,
        setActiveCategory,
        visibleCount,
        loadMore,
        hasMore,
        resetPagination,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeed must be inside FeedProvider");
  return ctx;
}
