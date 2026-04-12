import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Platform, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function SSOCallbackScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (window.opener) {
        handled.current = true;
        try {
          window.opener.postMessage({ type: "PATENT_SSO_DONE" }, window.location.origin);
        } catch {}
        window.close();

        setTimeout(() => {
          router.replace("/(tabs)");
        }, 500);
        return;
      }
    }

    if (!isLoaded) return;
    handled.current = true;
    router.replace("/(tabs)");
  }, [isLoaded, isSignedIn]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0f" }}>
      <ActivityIndicator color="#f0e040" size="large" />
    </View>
  );
}
