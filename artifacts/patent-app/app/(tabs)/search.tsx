import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import QuestionCard from "@/components/QuestionCard";
import TipCard from "@/components/TipCard";
import { useSettings } from "@/context/SettingsContext";
import { CATEGORIES, FEED_ITEMS, FeedItem, Question, Tip } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const categoryIcons: Record<string, string> = {
  all: "grid", home: "home", food: "coffee", business: "briefcase",
  health: "heart", tech: "cpu", nature: "sun",
};

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, isRTL, langCode } = useSettings();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("all");
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const dir = isRTL ? "row-reverse" : "row";
  const textAlign = isRTL ? "right" : "left";

  const categoryLabels: Record<string, string> = {
    all: t("all"), home: t("home"), food: t("food"),
    business: t("business"), health: t("health"), tech: t("tech"), nature: t("nature"),
  };

  const categoryMap: Record<string, string> = {
    home: "בית", food: "אוכל", business: "עסקים",
    health: "בריאות", tech: "טכנולוגיה", nature: "טבע",
  };

  const filtered = FEED_ITEMS.filter((item) => {
    const matchCat = selected === "all" || item.categoryId === selected;
    const matchQ = !query.trim() || item.text.toLowerCase().includes(query.trim().toLowerCase());
    return matchCat && matchQ;
  });

  const renderItem = ({ item }: { item: FeedItem }) => {
    if (item.type === "tip") return <TipCard tip={item as Tip} />;
    return <QuestionCard question={item as Question} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface2, borderColor: colors.border, flexDirection: dir }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} style={{ marginHorizontal: 10 }} />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder={t("searchPlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            textAlign={textAlign as any}
            testID="search-input"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")} style={{ marginHorizontal: 10 }}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        horizontal
        data={CATEGORIES.filter((c) => c.id !== "all")}
        keyExtractor={(c) => c.id}
        renderItem={({ item: cat }) => (
          <TouchableOpacity
            style={[
              styles.catBtn,
              { flexDirection: dir },
              selected === cat.id
                ? { backgroundColor: "rgba(240,224,64,0.15)", borderColor: "rgba(240,224,64,0.5)" }
                : { backgroundColor: colors.surface2, borderColor: colors.border },
            ]}
            onPress={() => setSelected(selected === cat.id ? "all" : cat.id)}
            testID={`cat-btn-${cat.id}`}
          >
            <Feather name={categoryIcons[cat.id] as any} size={14} color={selected === cat.id ? colors.primary : colors.mutedForeground} />
            <Text style={[styles.catBtnText, { color: selected === cat.id ? colors.primary : colors.mutedForeground }]}>
              {categoryLabels[cat.id] ?? cat.label}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={[styles.catList, { flexDirection: isRTL ? "row-reverse" : "row" }]}
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={filtered.length > 0}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={36} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground, textAlign: "center" }]}>
              {query ? `${t("noResults")} "${query}"` : t("chooseCategory")}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#1c1c27" },
  searchBar: { alignItems: "center", borderRadius: 12, borderWidth: 1, height: 44 },
  input: { flex: 1, fontSize: 15, paddingHorizontal: 4 },
  catScroll: { maxHeight: 56, borderBottomWidth: 1, borderBottomColor: "#1c1c27" },
  catList: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  catBtn: { alignItems: "center", borderRadius: 100, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 5, gap: 6 },
  catBtnText: { fontSize: 13, fontWeight: "500" as const },
  list: { paddingHorizontal: 16, paddingTop: 12 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15 },
});
