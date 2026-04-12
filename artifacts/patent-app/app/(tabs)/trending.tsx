import { Feather } from "@expo/vector-icons";
import React from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TipCard from "@/components/TipCard";
import { useSettings } from "@/context/SettingsContext";
import { Tip, TRENDING_TIPS } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

export default function TrendingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useSettings();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const dir = isRTL ? "row-reverse" : "row";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, flexDirection: dir }]}>
        <Feather name="trending-up" size={20} color={colors.primary} />
        <Text style={[styles.title, { color: colors.foreground }]}>{t("trending")}</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground, textAlign: isRTL ? "right" : "left" }]}>
          {t("trendingDesc")}
        </Text>
      </View>

      <FlatList
        data={TRENDING_TIPS as Tip[]}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View>
            <View style={[styles.rankRow, { flexDirection: dir }]}>
              <Text style={[styles.rank, { color: index === 0 ? colors.primary : colors.mutedForeground }]}>
                {t("rank")}{index + 1}
              </Text>
              {index === 0 && (
                <View style={[styles.topBadge, { backgroundColor: "rgba(240,224,64,0.12)", borderColor: "rgba(240,224,64,0.3)" }]}>
                  <Text style={[styles.topBadgeText, { color: colors.primary }]}>{t("number1Today")}</Text>
                </View>
              )}
            </View>
            <TipCard tip={item} />
          </View>
        )}
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="trending-up" size={36} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t("feedEmpty")}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1c1c27",
    alignItems: "center",
    gap: 10,
  },
  title: { fontSize: 22, fontWeight: "800" as const },
  sub: { fontSize: 13, flex: 1 },
  list: { paddingHorizontal: 16, paddingTop: 12 },
  rankRow: { alignItems: "center", marginBottom: 6, gap: 10 },
  rank: { fontSize: 20, fontWeight: "800" as const },
  topBadge: { borderRadius: 100, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1 },
  topBadgeText: { fontSize: 11, fontWeight: "600" as const },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15 },
});
