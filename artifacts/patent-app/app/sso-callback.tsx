import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function SSOCallbackScreen() {
  useEffect(() => {
    router.replace("/(tabs)");
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0f" }}>
      <ActivityIndicator color="#f0e040" size="large" />
    </View>
  );
}
