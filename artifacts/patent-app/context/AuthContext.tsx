import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/expo";

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
  logout: () => void;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, signOut, isLoaded } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);
  const prevSignedIn = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (prevSignedIn.current === false && isSignedIn === true) {
      setShowLoginModal(false);
      if (pendingAction.current) {
        const action = pendingAction.current;
        pendingAction.current = null;
        setTimeout(action, 200);
      }
    }
    prevSignedIn.current = isSignedIn ?? false;
  }, [isSignedIn, isLoaded]);

  const logout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const requireAuth = useCallback(
    (action: () => void) => {
      if (isSignedIn) {
        action();
      } else {
        pendingAction.current = action;
        setShowLoginModal(true);
      }
    },
    [isSignedIn]
  );

  const user: AuthUser | null = clerkUser
    ? {
        id: clerkUser.id,
        name:
          clerkUser.fullName ??
          clerkUser.username ??
          clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0] ??
          "משתמש",
        email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
        initials: getInitials(
          clerkUser.fullName ??
            clerkUser.username ??
            clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0] ??
            "U"
        ),
        avatarColor: "#4285F4",
        avatarUrl: clerkUser.imageUrl,
        provider: clerkUser.externalAccounts[0]?.provider ?? "google",
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!isSignedIn,
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
