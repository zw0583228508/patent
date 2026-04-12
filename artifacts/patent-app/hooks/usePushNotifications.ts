import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowAlert: true,
  }),
});

const PUSH_TOKEN_KEY = "patent_push_token";

export function usePushNotifications() {
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
      console.log("Notification received:", notification.request.content.title);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification tapped:", response.notification.request.content.data);
    });

    return () => {
      notifListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

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
      AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    } catch (e) {
      console.log("Push notification setup failed:", e);
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
