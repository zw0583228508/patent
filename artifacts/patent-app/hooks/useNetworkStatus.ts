import { useEffect, useState } from "react";
import { AppState, Platform } from "react-native";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (Platform.OS === "web") {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }

    let mounted = true;

    async function checkOnline() {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const res = await fetch("https://dns.google/resolve?name=google.com&type=A", {
          signal: controller.signal,
          cache: "no-store",
        });
        clearTimeout(timeout);
        if (mounted) setIsOnline(res.ok);
      } catch {
        if (mounted) setIsOnline(false);
      }
    }

    checkOnline();

    const interval = setInterval(checkOnline, 10000);

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") checkOnline();
    });

    return () => {
      mounted = false;
      clearInterval(interval);
      sub.remove();
    };
  }, []);

  return isOnline;
}
