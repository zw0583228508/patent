import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import QuestionCard from "@/components/QuestionCard";
import TipCard from "@/components/TipCard";
import { useFeed } from "@/context/FeedContext";
import { useSettings } from "@/context/SettingsContext";
import { CATEGORIES, FeedItem, Question, Tip } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

function CategoryPill({ id, label, active, onPress }: { id: string; label: string; active: boolean; onPress: () => void }) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[
        styles.pill,
        active
          ? { backgroundColor: "rgba(240,224,64,0.15)", borderColor: "rgba(240,224,64,0.5)" }
          : { backgroundColor: colors.surface2, borderColor: colors.border },
      ]}
      onPress={onPress}
      testID={`category-${id}`}
    >
      <Text style={[styles.pillText, { color: active ? colors.primary : colors.mutedForeground }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function FeedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items, activeCategory, setActiveCategory } = useFeed();
  const { t, isRTL, langCode } = useSettings();

  const renderItem = useCallback(({ item }: { item: FeedItem }) => {
    if (item.type === "tip") return <TipCard tip={item as Tip} />;
    return <QuestionCard question={item as Question} />;
  }, []);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const categoryLabels: Record<string, string> = {
    all: t("all"), home: t("home"), food: t("food"),
    business: t("business"), health: t("health"), tech: t("tech"), nature: t("nature"),
  };

  const dir = isRTL ? "row-reverse" : "row";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, flexDirection: dir }]}>
        <Text style={[styles.logo, { color: colors.primary }]}>{t("appName")}</Text>
        <View style={[styles.headerIcons, { flexDirection: dir }]}>
          <TouchableOpacity style={styles.iconBtn} testID="notifications-btn">
            <Feather name="bell" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push("/(tabs)/search")} testID="search-btn">
            <Feather name="search" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={items.length > 0}
        ListHeaderComponent={
          <FlatList
            horizontal
            data={CATEGORIES}
            keyExtractor={(c) => c.id}
            renderItem={({ item: cat }) => (
              <CategoryPill
                id={cat.id}
                label={categoryLabels[cat.id] ?? cat.label}
                active={activeCategory === cat.id}
                onPress={() => setActiveCategory(cat.id)}
              />
            )}
            contentContainerStyle={[styles.categories, { flexDirection: isRTL ? "row-reverse" : "row" }]}
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesRow}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={36} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t("nothingInCategory")}</Text>
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
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#1c1c27",
  },
  logo: { fontSize: 26, fontWeight: "800" as const, letterSpacing: -0.5 },
  headerIcons: { gap: 4 },
  iconBtn: { padding: 8 },
  categoriesRow: { marginBottom: 12, marginTop: 4 },
  categories: { paddingHorizontal: 16, gap: 8 },
  pill: { borderRadius: 100, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 6 },
  pillText: { fontSize: 13, fontWeight: "500" as const },
  list: { paddingHorizontal: 16, paddingTop: 4 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15 },
});
