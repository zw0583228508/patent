import * as WebBrowser from "expo-web-browser";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { useAuth } from "@/context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

export default function SSOCallbackScreen() {
  const { token, error } = useLocalSearchParams<{ token?: string; error?: string }>();
  const { login } = useAuth();

  useEffect(() => {
    async function handle() {
      if (token) {
        try {
          await login(decodeURIComponent(token));
        } catch {}
      }
      router.replace("/(tabs)");
    }
    handle();
  }, [token]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0f", gap: 16 }}>
      <ActivityIndicator color="#f0e040" size="large" />
      {error && (
        <Text style={{ color: "#f04040", fontSize: 14 }}>
          {error === "cancelled" ? "ההתחברות בוטלה" : "שגיאה בהתחברות"}
        </Text>
      )}
    </View>
  );
}
