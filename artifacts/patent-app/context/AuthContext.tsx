import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  provider: "google" | "facebook";
};

type AuthContextType = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (v: boolean) => void;
  requireAuth: (action: () => void) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("@patent:auth_user").then((json) => {
      if (json) setUser(JSON.parse(json));
    });
  }, []);

  const login = useCallback((u: AuthUser) => {
    setUser(u);
    AsyncStorage.setItem("@patent:auth_user", JSON.stringify(u));
    setShowLoginModal(false);
    if (pendingAction.current) {
      const action = pendingAction.current;
      pendingAction.current = null;
      setTimeout(action, 150);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    AsyncStorage.removeItem("@patent:auth_user");
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
      value={{ user, isLoggedIn: !!user, login, logout, showLoginModal, setShowLoginModal, requireAuth }}
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
