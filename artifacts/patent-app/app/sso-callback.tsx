import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Platform, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function SSOCallbackScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const handled = useRef(false);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (handled.current) return;

    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (window.opener) {
        if (!isLoaded) return;

        if (isSignedIn) {
          handled.current = true;
          if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
          try {
            window.opener.postMessage({ type: "PATENT_SSO_DONE" }, window.location.origin);
          } catch {}
          window.close();
          return;
        }

        if (!fallbackTimer.current) {
          fallbackTimer.current = setTimeout(() => {
            if (!handled.current) {
              handled.current = true;
              try {
                window.opener.postMessage({ type: "PATENT_SSO_DONE" }, window.location.origin);
              } catch {}
              window.close();
            }
          }, 8000);
        }
        return;
      }
    }

    if (!isLoaded) return;
    handled.current = true;
    router.replace("/(tabs)");
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    return () => {
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0f" }}>
      <ActivityIndicator color="#f0e040" size="large" />
    </View>
  );
}
