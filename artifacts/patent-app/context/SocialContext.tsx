import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type SocialContextType = {
  followedUsers: Set<string>;
  follow: (userId: string) => void;
  unfollow: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
};

const SocialContext = createContext<SocialContextType | null>(null);

export function SocialProvider({ children }: { children: React.ReactNode }) {
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    AsyncStorage.getItem("@patent:following").then((json) => {
      if (json) setFollowedUsers(new Set(JSON.parse(json)));
    });
  }, []);

  const follow = useCallback((userId: string) => {
    setFollowedUsers((prev) => {
      const next = new Set(prev);
      next.add(userId);
      AsyncStorage.setItem("@patent:following", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const unfollow = useCallback((userId: string) => {
    setFollowedUsers((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      AsyncStorage.setItem("@patent:following", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isFollowing = useCallback(
    (userId: string) => followedUsers.has(userId),
    [followedUsers]
  );

  return (
    <SocialContext.Provider value={{ followedUsers, follow, unfollow, isFollowing }}>
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const ctx = useContext(SocialContext);
  if (!ctx) throw new Error("useSocial must be inside SocialProvider");
  return ctx;
}
