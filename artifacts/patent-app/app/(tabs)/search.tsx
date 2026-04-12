import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import QuestionCard from "@/components/QuestionCard";
import TipCard from "@/components/TipCard";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useSocial } from "@/context/SocialContext";
import { CATEGORIES, FEED_ITEMS, FeedItem, Question, Tip } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";
import { ApiUser, api } from "@/utils/api";

const categoryIcons: Record<string, string> = {
  all: "grid", home: "home", food: "coffee", business: "briefcase",
  health: "heart", tech: "cpu", nature: "sun",
};

const GRADIENT_COLORS: Record<string, string> = {
  primary: "#f0e040", cyan: "#40e0f0", pink: "#f040a0",
  green: "#40e040", red: "#f04040", purple: "#a040f0",
};

function getAvatarColor(gradient: string): string {
  return GRADIENT_COLORS[gradient] ?? "#f0e040";
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type SuggestedUser = ApiUser & { mutualFollowers: number };

function UserCard({ user, isSuggested = false }: { user: SuggestedUser; isSuggested?: boolean }) {
  const colors = useColors();
  const { t, isRTL } = useSettings();
  const { user: me } = useAuth();
  const { isFollowing, follow, unfollow } = useSocial();
  const following = isFollowing(user.id);
  const dir = isRTL ? "row-reverse" : "row";
  const avatarColor = getAvatarColor(user.avatarGradient);
  const initials = getInitials(user.name);

  function handleFollow() {
    if (following) {
      unfollow(user.id);
      if (me?.id) api.users.follow(user.id, me.id).catch(() => {});
    } else {
      follow(user.id);
      if (me?.id) api.users.follow(user.id, me.id).catch(() => {});
    }
  }

  return (
    <TouchableOpacity
      style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: dir }]}
      onPress={() => router.push(`/profile/${user.id}` as any)}
      testID={`user-card-${user.id}`}
      activeOpacity={0.75}
    >
      <View style={[styles.userAvatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.userAvatarText}>{initials}</Text>
      </View>
      <View style={[styles.userInfo, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
        <Text style={[styles.userName, { color: colors.foreground }]}>{user.name}</Text>
        <Text style={[styles.userHandle, { color: colors.mutedForeground }]}>@{user.username}</Text>
        {isSuggested && user.mutualFollowers > 0 ? (
          <View style={[styles.mutualBadge, { flexDirection: dir }]}>
            <Feather name="users" size={10} color={colors.accentCyan} />
            <Text style={[styles.mutualText, { color: colors.accentCyan }]}>
              {user.mutualFollowers} {t("mutualFollowers")}
            </Text>
          </View>
        ) : isSuggested && user.followersCount > 0 ? (
          <View style={[styles.mutualBadge, { flexDirection: dir }]}>
            <Feather name="trending-up" size={10} color={colors.accentPink} />
            <Text style={[styles.mutualText, { color: colors.accentPink }]}>{t("popularUser")}</Text>
          </View>
        ) : user.bio ? (
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
          onPress={(e) => { e.stopPropagation(); handleFollow(); }}
          testID={`follow-user-${user.id}`}
        >
          <Text style={[styles.followBtnText, { color: following ? colors.mutedForeground : colors.primaryForeground }]}>
            {following ? t("unfollow") : t("follow")}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.tipsCount, { color: colors.mutedForeground }]}>{user.tipsCount ?? 0} {t("tips")}</Text>
      </View>
    </TouchableOpacity>
  );
}

type SearchMode = "content" | "users";

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useSettings();
  const { user: me } = useAuth();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("all");
  const [searchMode, setSearchMode] = useState<SearchMode>("content");

  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SuggestedUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const dir = isRTL ? "row-reverse" : "row";
  const textAlign = isRTL ? "right" : "left";

  const categoryLabels: Record<string, string> = {
    all: t("all"), home: t("home"), food: t("food"),
    business: t("business"), health: t("health"), tech: t("tech"), nature: t("nature"),
  };

  useEffect(() => {
    if (searchMode !== "users" || !me?.id) return;
    setSuggestionsLoading(true);
    api.users.getSuggestions(me.id, 12)
      .then(setSuggestions)
      .catch(() => setSuggestions([]))
      .finally(() => setSuggestionsLoading(false));
  }, [searchMode, me?.id]);

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) { setSearchResults([]); return; }
    setSearchLoading(true);
    api.users.list({ search: q, limit: 20 })
      .then((users) => setSearchResults(users.map((u) => ({ ...u, mutualFollowers: 0 }))))
      .catch(() => setSearchResults([]))
      .finally(() => setSearchLoading(false));
  }, []);

  useEffect(() => {
    if (searchMode !== "users") return;
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => doSearch(query), 350);
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [query, searchMode, doSearch]);

  const filteredContent = FEED_ITEMS.filter((item) => {
    const matchCat = selected === "all" || item.categoryId === selected;
    const matchQ = !query.trim() || item.text.toLowerCase().includes(query.trim().toLowerCase());
    return matchCat && matchQ;
  });

  const renderContentItem = ({ item, index }: { item: FeedItem; index: number }) => {
    if (item.type === "tip") return <TipCard tip={item as Tip} index={index} />;
    return <QuestionCard question={item as Question} index={index} />;
  };

  const showingSuggestions = searchMode === "users" && !query.trim();
  const displayUsers = query.trim() ? searchResults : suggestions;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
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

        <View style={[styles.modeToggle, { flexDirection: dir }]}>
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
          data={filteredContent}
          keyExtractor={(item) => item.id}
          renderItem={renderContentItem}
          contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={filteredContent.length > 0}
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
          data={displayUsers}
          keyExtractor={(u) => u.id}
          renderItem={({ item }) => <UserCard user={item} isSuggested={showingSuggestions} />}
          contentContainerStyle={[styles.userList, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            showingSuggestions ? (
              <View style={[styles.sectionHeader, { flexDirection: dir }]}>
                <Feather name="user-plus" size={15} color={colors.accentCyan} />
                <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign }]}>
                  {t("suggestedForYou")}
                </Text>
              </View>
            ) : query.trim() ? (
              <View style={[styles.sectionHeader, { flexDirection: dir }]}>
                <Feather name="search" size={15} color={colors.mutedForeground} />
                <Text style={[styles.sectionTitle, { color: colors.mutedForeground, textAlign }]}>
                  {t("searchUsers")}
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            suggestionsLoading || searchLoading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : (
              <View style={styles.empty}>
                <Feather name="user-x" size={36} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground, textAlign: "center" }]}>
                  {query.trim() ? t("noUsersFound") : t("noSuggestions")}
                </Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8, borderBottomWidth: 1, gap: 10 },
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
  sectionHeader: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700" as const, flex: 1 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15 },
  loadingWrap: { alignItems: "center", paddingTop: 60 },
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
  mutualBadge: { alignItems: "center", gap: 4, marginTop: 3 },
  mutualText: { fontSize: 11, fontWeight: "500" as const },
  userRight: { gap: 6 },
  followBtn: {
    borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1, flexShrink: 0,
  },
  followBtnText: { fontSize: 12, fontWeight: "600" as const },
  tipsCount: { fontSize: 11 },
});
