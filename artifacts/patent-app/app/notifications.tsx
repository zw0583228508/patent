import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useColors } from "@/hooks/useColors";
import { api, ApiNotification } from "@/utils/api";

const ICON_MAP: Record<string, string> = {
  like: "heart",
  comment: "message-circle",
  follow: "user-plus",
  vote: "thumbs-up",
};

const COLOR_MAP: Record<string, string> = {
  like: "#f040a0",
  comment: "#40e0f0",
  follow: "#f0e040",
  vote: "#40e040",
};

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "עכשיו";
  if (diff < 3600) return `לפני ${Math.floor(diff / 60)} דק'`;
  if (diff < 86400) return `לפני ${Math.floor(diff / 3600)} שע'`;
  return `לפני ${Math.floor(diff / 86400)} ימים`;
}

function NotifRow({ notif, onPress }: { notif: ApiNotification; onPress: () => void }) {
  const colors = useColors();
  const { isRTL } = useSettings();
  const icon = ICON_MAP[notif.type] ?? "bell";
  const color = COLOR_MAP[notif.type] ?? colors.primary;
  const dir = isRTL ? "row-reverse" : "row";

  return (
    <TouchableOpacity
      style={[
        styles.row,
        {
          backgroundColor: notif.isRead ? colors.surface : colors.surface2,
          borderColor: notif.isRead ? "transparent" : color + "22",
          flexDirection: dir,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconWrap, { backgroundColor: color + "18", borderColor: color + "33" }]}>
        <Feather name={icon as any} size={18} color={color} />
      </View>

      <View style={[styles.textWrap, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
        <Text style={[styles.title, { color: colors.foreground, textAlign: isRTL ? "right" : "left" }]}>
          {notif.title}
        </Text>
        <Text
          style={[styles.body, { color: colors.mutedForeground, textAlign: isRTL ? "right" : "left" }]}
          numberOfLines={2}
        >
          {notif.body}
        </Text>
        <Text style={[styles.time, { color: colors.mutedForeground }]}>{timeAgo(notif.createdAt)}</Text>
      </View>

      {!notif.isRead && <View style={[styles.dot, { backgroundColor: color }]} />}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { t, isRTL } = useSettings();

  const [notifs, setNotifs] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await api.notifications.list(user.id, { limit: 50 });
      setNotifs(res.data);
      setUnreadCount(res.unreadCount);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleNotifPress(notif: ApiNotification) {
    if (!notif.isRead) {
      setNotifs((prev) => prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
      api.notifications.markRead(notif.id).catch(() => {});
    }
    if (notif.postId) {
      router.push(`/?postId=${notif.postId}` as any);
    } else if (notif.actorId) {
      router.push(`/profile/${notif.actorId}` as any);
    }
  }

  async function handleMarkAll() {
    if (!user?.id || unreadCount === 0) return;
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    api.notifications.markAllRead(user.id).catch(() => {});
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 12,
            borderBottomColor: colors.border,
            flexDirection: isRTL ? "row-reverse" : "row",
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={24} color={colors.foreground} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t("notifications") ?? "התראות"}</Text>

        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAll} style={styles.markAllBtn} hitSlop={8}>
            <Text style={[styles.markAllText, { color: colors.primary }]}>{"סמן הכל כנקרא"}</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifs.length === 0 ? (
        <View style={styles.center}>
          <Feather name="bell-off" size={40} color={colors.mutedForeground} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{"אין התראות עדיין"}</Text>
        </View>
      ) : (
        <FlatList
          data={notifs}
          keyExtractor={(n) => n.id}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20, paddingHorizontal: 16, paddingTop: 12 }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); load(); }}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <NotifRow notif={item} onPress={() => handleNotifPress(item)} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  header: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "700" },
  markAllBtn: { paddingVertical: 4, paddingHorizontal: 8 },
  markAllText: { fontSize: 13, fontWeight: "600" },
  row: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textWrap: { flex: 1, gap: 3 },
  title: { fontSize: 14, fontWeight: "600", lineHeight: 20 },
  body: { fontSize: 13, lineHeight: 18 },
  time: { fontSize: 11, marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4, flexShrink: 0 },
  emptyText: { fontSize: 15 },
});
