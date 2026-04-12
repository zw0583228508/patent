import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TipCard from "@/components/TipCard";
import { useSettings } from "@/context/SettingsContext";
import { FEED_ITEMS, Tip, USER_PROFILE, USER_TIPS } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  const colors = useColors();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
      <Text style={[styles.statValue, { color: color ?? colors.primary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const SAVED_TIPS = FEED_ITEMS.filter((item): item is Tip => item.type === "tip").slice(0, 3);

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useSettings();
  const [tab, setTab] = useState<"tips" | "saved">("tips");
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const dir = isRTL ? "row-reverse" : "row";

  const tabData = tab === "tips" ? USER_TIPS : (SAVED_TIPS as Tip[]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={tabData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TipCard tip={item} />}
        contentContainerStyle={[styles.listContent, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={[styles.header, { paddingTop: topPad + 8, flexDirection: dir }]}>
              <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t("profile")}</Text>
              <TouchableOpacity
                style={styles.settingsBtn}
                onPress={() => router.push("/settings")}
                testID="settings-btn"
              >
                <Feather name="settings" size={22} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.avatarLarge, { backgroundColor: USER_PROFILE.avatarGradient[0] }]}>
                <Text style={styles.avatarLargeText}>{USER_PROFILE.initials}</Text>
              </View>
              <Text style={[styles.name, { color: colors.foreground }]}>{USER_PROFILE.name}</Text>
              <Text style={[styles.username, { color: colors.mutedForeground }]}>{USER_PROFILE.username}</Text>

              <View style={[styles.expertBadge, { flexDirection: dir, backgroundColor: "rgba(64,224,64,0.12)", borderColor: "rgba(64,224,64,0.3)" }]}>
                <Feather name="award" size={12} color={colors.accentGreen} />
                <Text style={[styles.expertText, { color: colors.accentGreen }]}>
                  {t("verifiedExpert")} · {USER_PROFILE.trustScore}%
                </Text>
              </View>
            </View>

            <View style={[styles.statsRow, { flexDirection: dir }]}>
              <StatCard label={t("tips")} value={USER_PROFILE.tipsCount} />
              <StatCard label={t("workedForMe")} value={`${(USER_PROFILE.workedCount / 1000).toFixed(1)}k`} color={colors.accentGreen} />
              <StatCard label={t("saved")} value={USER_PROFILE.savedCount} color={colors.accentCyan} />
            </View>

            <View style={[styles.tabs, { borderColor: colors.border, flexDirection: dir }]}>
              <TouchableOpacity
                style={[styles.tabBtn, tab === "tips" && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
                onPress={() => setTab("tips")}
                testID="tab-my-tips"
              >
                <Text style={[styles.tabBtnText, { color: tab === "tips" ? colors.primary : colors.mutedForeground }]}>
                  {t("myTips")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabBtn, tab === "saved" && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
                onPress={() => setTab("saved")}
                testID="tab-saved"
              >
                <Text style={[styles.tabBtnText, { color: tab === "saved" ? colors.primary : colors.mutedForeground }]}>
                  {t("saved")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="bookmark" size={36} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {tab === "saved" ? t("noSaved") : t("noTips")}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1c1c27",
  },
  headerTitle: { fontSize: 22, fontWeight: "800" as const },
  settingsBtn: { padding: 6 },
  profileCard: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    margin: 16,
    padding: 24,
    gap: 8,
  },
  avatarLarge: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  avatarLargeText: { fontSize: 24, fontWeight: "700" as const, color: "#0a0a0f" },
  name: { fontSize: 20, fontWeight: "700" as const },
  username: { fontSize: 14 },
  expertBadge: {
    alignItems: "center", borderRadius: 100,
    paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, gap: 6, marginTop: 4,
  },
  expertText: { fontSize: 12, fontWeight: "600" as const },
  statsRow: { gap: 10, paddingHorizontal: 16, marginBottom: 16 },
  statCard: {
    flex: 1, alignItems: "center", borderRadius: 14,
    borderWidth: 1, paddingVertical: 14, gap: 4,
  },
  statValue: { fontSize: 22, fontWeight: "800" as const },
  statLabel: { fontSize: 12 },
  tabs: { borderBottomWidth: 1, marginHorizontal: 16, marginBottom: 12 },
  tabBtn: {
    flex: 1, alignItems: "center", paddingVertical: 12,
    borderBottomWidth: 2, borderBottomColor: "transparent",
  },
  tabBtnText: { fontSize: 14, fontWeight: "600" as const },
  listContent: { paddingHorizontal: 16 },
  empty: { alignItems: "center", paddingTop: 40, gap: 12 },
  emptyText: { fontSize: 15 },
});
