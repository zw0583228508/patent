import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import QuestionCard from "@/components/QuestionCard";
import TipCard from "@/components/TipCard";
import { useSettings } from "@/context/SettingsContext";
import { useSocial } from "@/context/SocialContext";
import { CATEGORIES, FEED_ITEMS, FeedItem, MockUser, MOCK_USERS, Question, Tip } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const categoryIcons: Record<string, string> = {
  all: "grid", home: "home", food: "coffee", business: "briefcase",
  health: "heart", tech: "cpu", nature: "sun",
};

function UserCard({ user }: { user: MockUser }) {
  const colors = useColors();
  const { t, isRTL } = useSettings();
  const { isFollowing, follow, unfollow } = useSocial();
  const following = isFollowing(user.id);
  const dir = isRTL ? "row-reverse" : "row";

  return (
    <TouchableOpacity
      style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: dir }]}
      onPress={() => router.push(`/profile/${user.id}` as any)}
      testID={`user-card-${user.id}`}
    >
      <View style={[styles.userAvatar, { backgroundColor: user.avatarGradient[0] }]}>
        <Text style={styles.userAvatarText}>{user.initials}</Text>
      </View>
      <View style={[styles.userInfo, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
        <Text style={[styles.userName, { color: colors.foreground }]}>{user.name}</Text>
        <Text style={[styles.userHandle, { color: colors.mutedForeground }]}>{user.username}</Text>
        {user.bio ? (
          <Text style={[styles.userBio, { color: colors.mutedForeground }]} numberOfLines={1}>{user.bio}</Text>
        ) : null}
      </View>
      <View style={[styles.userRight, { alignItems: "flex-end" }]}>
        <TouchableOpacity
          style={[
            styles.followBtn,
            {
              backgroundColor: following ? "transparent" : colors.primary,
              borderColor: following ? colors.border : colors.primary,
            },
          ]}
          onPress={(e) => { e.stopPropagation(); following ? unfollow(user.id) : follow(user.id); }}
          testID={`follow-user-${user.id}`}
        >
          <Text style={[styles.followBtnText, { color: following ? colors.mutedForeground : colors.primaryForeground }]}>
            {following ? t("unfollow") : t("follow")}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.tipsCount, { color: colors.mutedForeground }]}>{user.tipsCount} {t("tips")}</Text>
      </View>
    </TouchableOpacity>
  );
}

type SearchMode = "content" | "users";

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useSettings();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("all");
  const [searchMode, setSearchMode] = useState<SearchMode>("content");
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const dir = isRTL ? "row-reverse" : "row";
  const textAlign = isRTL ? "right" : "left";

  const categoryLabels: Record<string, string> = {
    all: t("all"), home: t("home"), food: t("food"),
    business: t("business"), health: t("health"), tech: t("tech"), nature: t("nature"),
  };

  const filtered = FEED_ITEMS.filter((item) => {
    const matchCat = selected === "all" || item.categoryId === selected;
    const matchQ = !query.trim() || item.text.toLowerCase().includes(query.trim().toLowerCase());
    return matchCat && matchQ;
  });

  const filteredUsers = MOCK_USERS.filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      (u.bio ?? "").toLowerCase().includes(q)
    );
  });

  const renderItem = ({ item, index }: { item: FeedItem; index: number }) => {
    if (item.type === "tip") return <TipCard tip={item as Tip} index={index} />;
    return <QuestionCard question={item as Question} index={index} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface2, borderColor: colors.border, flexDirection: dir }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} style={{ marginHorizontal: 10 }} />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder={searchMode === "users" ? t("searchUsers") : t("searchPlaceholder")}
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

        <View style={[styles.modeToggle, { flexDirection: dir, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[
              styles.modeBtn,
              searchMode === "content" && { backgroundColor: "rgba(240,224,64,0.15)", borderColor: "rgba(240,224,64,0.4)" },
              searchMode !== "content" && { backgroundColor: "transparent", borderColor: "transparent" },
            ]}
            onPress={() => setSearchMode("content")}
            testID="mode-content"
          >
            <Feather name="file-text" size={14} color={searchMode === "content" ? colors.primary : colors.mutedForeground} />
            <Text style={[styles.modeBtnText, { color: searchMode === "content" ? colors.primary : colors.mutedForeground }]}>
              {t("tips")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeBtn,
              searchMode === "users" && { backgroundColor: "rgba(64,224,240,0.12)", borderColor: "rgba(64,224,240,0.4)" },
              searchMode !== "users" && { backgroundColor: "transparent", borderColor: "transparent" },
            ]}
            onPress={() => setSearchMode("users")}
            testID="mode-users"
          >
            <Feather name="users" size={14} color={searchMode === "users" ? colors.accentCyan : colors.mutedForeground} />
            <Text style={[styles.modeBtnText, { color: searchMode === "users" ? colors.accentCyan : colors.mutedForeground }]}>
              {t("users")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {searchMode === "content" && (
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
          style={[styles.catScroll, { borderBottomColor: colors.border }]}
        />
      )}

      {searchMode === "content" ? (
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
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(u) => u.id}
          renderItem={({ item }) => <UserCard user={item} />}
          contentContainerStyle={[styles.userList, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="users" size={36} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground, textAlign: "center" }]}>
                {t("noUsersFound")}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: "#1c1c27", gap: 10 },
  searchBar: { alignItems: "center", borderRadius: 12, borderWidth: 1, height: 44 },
  input: { flex: 1, fontSize: 15, paddingHorizontal: 4 },
  modeToggle: { gap: 8, paddingBottom: 4 },
  modeBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 100, borderWidth: 1,
  },
  modeBtnText: { fontSize: 13, fontWeight: "600" as const },
  catScroll: { maxHeight: 56, borderBottomWidth: 1 },
  catList: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  catBtn: { alignItems: "center", borderRadius: 100, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 5, gap: 6 },
  catBtnText: { fontSize: 13, fontWeight: "500" as const },
  list: { paddingHorizontal: 16, paddingTop: 12 },
  userList: { paddingHorizontal: 16, paddingTop: 8 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15 },
  userCard: {
    borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10,
    gap: 12, alignItems: "center",
  },
  userAvatar: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  userAvatarText: { fontSize: 16, fontWeight: "700" as const, color: "#0a0a0f" },
  userInfo: { flex: 1, gap: 2 },
  userName: { fontSize: 15, fontWeight: "700" as const },
  userHandle: { fontSize: 12 },
  userBio: { fontSize: 12, marginTop: 2 },
  userRight: { gap: 6 },
  followBtn: {
    borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1, flexShrink: 0,
  },
  followBtnText: { fontSize: 12, fontWeight: "600" as const },
  tipsCount: { fontSize: 11 },
});
