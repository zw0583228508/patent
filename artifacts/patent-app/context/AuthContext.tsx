import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, setAuthToken } from "@/utils/api";

const TOKEN_KEY = "@patent:auth_token";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  avatarUrl?: string;
  provider: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  showLoginModal: boolean;
  setShowLoginModal: (v: boolean) => void;
  requireAuth: (action: () => void) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function parseToken(token: string): { userId: string; name: string; email: string; picture?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload.userId || !payload.name || !payload.email) return null;
    return payload;
  } catch {
    return null;
  }
}

function tokenToUser(token: string): AuthUser | null {
  const payload = parseToken(token);
  if (!payload) return null;
  return {
    id: payload.userId,
    name: payload.name,
    email: payload.email,
    initials: getInitials(payload.name),
    avatarColor: "#4285F4",
    avatarUrl: payload.picture,
    provider: "google",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);
  const prevLoggedIn = useRef<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY).then((token) => {
      if (token) {
        const parsed = tokenToUser(token);
        if (parsed) {
          setAuthToken(token);
          setUser(parsed);
        } else {
          AsyncStorage.removeItem(TOKEN_KEY);
        }
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const wasLoggedIn = prevLoggedIn.current;
    const nowLoggedIn = !!user;
    if (!wasLoggedIn && nowLoggedIn) {
      setShowLoginModal(false);
      if (pendingAction.current) {
        const action = pendingAction.current;
        pendingAction.current = null;
        setTimeout(action, 200);
      }
    }
    prevLoggedIn.current = nowLoggedIn;
  }, [user]);

  const login = useCallback(async (token: string) => {
    const parsed = tokenToUser(token);
    if (!parsed) throw new Error("Invalid auth token");
    setAuthToken(token);
    await AsyncStorage.setItem(TOKEN_KEY, token);
    setUser(parsed);

    api.users.upsert({
      id: parsed.id,
      name: parsed.name,
      username: parsed.id.replace("google_", "").slice(0, 8),
      bio: "",
      avatarGradient: "primary",
    }).catch(() => {});
  }, []);

  const logout = useCallback(async () => {
    setAuthToken(null);
    await AsyncStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const requireAuth = useCallback(
    (action: () => void) => {
      if (user) {
        action();
      } else {
        pendingAction.current = action;
        setShowLoginModal(true);
      }
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        logout,
        showLoginModal,
        setShowLoginModal,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
