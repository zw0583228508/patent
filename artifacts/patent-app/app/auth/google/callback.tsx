import * as WebBrowser from "expo-web-browser";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken } from "@/utils/api";

WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = "@patent:auth_token";

function getApiBase(): string {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}/api-server/api`;
  if (typeof window !== "undefined") return `${window.location.origin}/api-server/api`;
  return "http://localhost:8080/api";
}

export default function GoogleCallbackScreen() {
  const params = useLocalSearchParams<{ code?: string; error?: string; state?: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    async function handle() {
      if (params.error) {
        setErrMsg(params.error);
        setStatus("error");
        notifyParent(null, params.error);
        return;
      }

      if (!params.code) {
        setErrMsg("Missing authorization code");
        setStatus("error");
        notifyParent(null, "Missing authorization code");
        return;
      }

      try {
        const redirectUri = typeof window !== "undefined"
          ? `${window.location.origin}/auth/google/callback`
          : `${getApiBase().replace("/api-server/api", "")}/auth/google/callback`;

        const resp = await fetch(`${getApiBase()}/auth/google/exchange-code`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: params.code, redirectUri }),
        });

        const data = await resp.json();
        if (!resp.ok || !data.token) {
          throw new Error(data.error ?? "Exchange failed");
        }

        setAuthToken(data.token);
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
        setStatus("success");
        notifyParent(data.token, null);

        setTimeout(() => {
          if (typeof window !== "undefined" && window.opener && !window.opener.closed) {
            window.close();
          } else {
            router.replace("/(tabs)");
          }
        }, 300);
      } catch (err: any) {
        const msg = err?.message ?? "Authentication failed";
        setErrMsg(msg);
        setStatus("error");
        notifyParent(null, msg);
      }
    }

    handle();
  }, [params.code, params.error]);

  function notifyParent(token: string | null, error: string | null) {
    if (typeof window === "undefined") return;
    if (!window.opener || window.opener.closed) return;
    try {
      const msg = token
        ? { type: "PATENT_AUTH_DONE", token }
        : { type: "PATENT_AUTH_ERROR", error };
      window.opener.postMessage(msg, "*");
    } catch {}
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0f" }}>
      {status === "loading" && <ActivityIndicator color="#f0e040" size="large" />}
      {status === "success" && <Text style={{ color: "#40e040", fontSize: 16 }}>מחובר! סוגר...</Text>}
      {status === "error" && (
        <View style={{ alignItems: "center", gap: 12 }}>
          <Text style={{ color: "#f04040", fontSize: 16, textAlign: "center" }}>{errMsg}</Text>
          <Text
            style={{ color: "#f0e040", fontSize: 14, textDecorationLine: "underline" }}
            onPress={() => router.replace("/(tabs)")}
          >
            חזרה לדף הבית
          </Text>
        </View>
      )}
    </View>
  );
}
