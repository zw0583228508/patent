import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { api } from "../utils/api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowAlert: true,
  }),
});

const PUSH_TOKEN_KEY = "patent_push_token";
const PUSH_TOKEN_USER_KEY = "patent_push_token_user";

export function usePushNotifications(userId?: string | null) {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<"unknown" | "granted" | "denied">("unknown");
  const notifListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") return;

    AsyncStorage.getItem(PUSH_TOKEN_KEY).then((token) => {
      if (token) setPushToken(token);
    });

    registerForPushNotifications();

    notifListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("[Push] Received:", notification.request.content.title);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log("[Push] Tapped:", data);
    });

    return () => {
      notifListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!userId || !pushToken || Platform.OS === "web") return;
    syncTokenToServer(userId, pushToken);
  }, [userId, pushToken]);

  async function syncTokenToServer(uid: string, token: string) {
    try {
      const lastSyncedUser = await AsyncStorage.getItem(PUSH_TOKEN_USER_KEY);
      if (lastSyncedUser === `${uid}:${token}`) return;
      await api.users.savePushToken(uid, token);
      await AsyncStorage.setItem(PUSH_TOKEN_USER_KEY, `${uid}:${token}`);
      console.log("[Push] Token saved to server for user", uid);
    } catch (e) {
      console.log("[Push] Failed to sync token to server:", e);
    }
  }

  async function registerForPushNotifications() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      setPermissionStatus(finalStatus === "granted" ? "granted" : "denied");

      if (finalStatus !== "granted") return;

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setPushToken(token);
      await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    } catch (e) {
      console.log("[Push] Setup failed:", e);
    }
  }

  async function scheduleLocalNotification(title: string, body: string, data?: Record<string, unknown>) {
    if (Platform.OS === "web") return;
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data: data ?? {} },
      trigger: null,
    });
  }

  return { pushToken, permissionStatus, scheduleLocalNotification };
}
