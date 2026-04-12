import { useAuth } from "@clerk/expo";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function SSOCallbackScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigated = useRef(false);

  useEffect(() => {
    if (!isLoaded || navigated.current) return;

    if (isSignedIn) {
      navigated.current = true;
      router.replace("/(tabs)");
      return;
    }

    const timer = setTimeout(() => {
      if (!navigated.current) {
        navigated.current = true;
        router.replace("/(tabs)");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0f" }}>
      <ActivityIndicator color="#f0e040" size="large" />
    </View>
  );
}
