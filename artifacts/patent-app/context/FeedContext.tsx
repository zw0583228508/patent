import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { Comment, COMMENTS_MAP, FEED_ITEMS, FeedItem } from "@/data/mockData";

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
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
};

const FeedContext = createContext<FeedContextType | null>(null);

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [votes, setVotes] = useState<VoteMap>({});
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [likedIds, setLikedIds] = useState<LikeSet>(new Set());
  const [comments, setComments] = useState<CommentsMap>(COMMENTS_MAP);
  const [activeCategory, setActiveCategory] = useState("all");

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

  const items =
    activeCategory === "all"
      ? FEED_ITEMS
      : FEED_ITEMS.filter((item) => item.categoryId === activeCategory);

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
        activeCategory,
        setActiveCategory,
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
