import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { FEED_ITEMS, FeedItem } from "@/data/mockData";

type VoteMap = Record<string, "worked" | "didnt" | null>;

type FeedContextType = {
  items: FeedItem[];
  votes: VoteMap;
  savedIds: Set<string>;
  vote: (id: string, vote: "worked" | "didnt") => void;
  toggleSave: (id: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
};

const FeedContext = createContext<FeedContextType | null>(null);

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [votes, setVotes] = useState<VoteMap>({});
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    AsyncStorage.getItem("patent_votes").then((v) => {
      if (v) setVotes(JSON.parse(v));
    });
    AsyncStorage.getItem("patent_saved").then((v) => {
      if (v) setSavedIds(new Set(JSON.parse(v)));
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

  const categoryMap: Record<string, string> = {
    home: "בית",
    food: "אוכל",
    business: "עסקים",
    health: "בריאות",
    tech: "טכנולוגיה",
    nature: "טבע",
  };

  const items =
    activeCategory === "all"
      ? FEED_ITEMS
      : FEED_ITEMS.filter(
          (item) => item.category === (categoryMap[activeCategory] ?? activeCategory)
        );

  return (
    <FeedContext.Provider
      value={{ items, votes, savedIds, vote, toggleSave, activeCategory, setActiveCategory }}
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
