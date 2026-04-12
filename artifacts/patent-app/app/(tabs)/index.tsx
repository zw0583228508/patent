import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
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
import { useAuth } from "@/context/AuthContext";
import { useFeed } from "@/context/FeedContext";
import { useSettings } from "@/context/SettingsContext";
import { useSocial } from "@/context/SocialContext";
import { CATEGORIES, FeedItem, Question, Tip } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";
import { api } from "@/utils/api";

type FeedMode = "forYou" | "following" | "all";

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
  const { items, activeCategory, setActiveCategory, visibleCount, loadMore, hasMore, resetPagination } = useFeed();
  const { t, isRTL, followedTopics } = useSettings();
  const social = useSocial();
  const { user } = useAuth();
  const [feedMode, setFeedMode] = useState<FeedMode>("forYou");
  const [loadingMore, setLoadingMore] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const bellAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!user?.id) return;
    api.notifications.list(user.id, { limit: 1 }).then((res) => {
      setUnreadNotifs(res.unreadCount);
    }).catch(() => {});
  }, [user?.id]);

  function handleBellPress() {
    Animated.sequence([
      Animated.timing(bellAnim, { toValue: 1.3, duration: 80, useNativeDriver: true }),
      Animated.spring(bellAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    router.push("/notifications");
  }

  useEffect(() => {
    resetPagination();
  }, [feedMode]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const categoryLabels: Record<string, string> = {
    all: t("all"), home: t("home"), food: t("food"),
    business: t("business"), health: t("health"), tech: t("tech"), nature: t("nature"),
  };

  const dir = isRTL ? "row-reverse" : "row";

  const filteredItems = useMemo(() => {
    if (feedMode === "following") {
      const followed = social.followedUsers;
      if (followed.size === 0) return [];
      return items.filter((item) => followed.has(item.userId));
    }
    if (feedMode === "forYou") {
      if (followedTopics.length === 0) return items;
      return items.filter((item) => followedTopics.includes(item.categoryId));
    }
    return items;
  }, [items, feedMode, social.followedUsers, followedTopics]);

  const displayItems = useMemo(() => filteredItems.slice(0, visibleCount), [filteredItems, visibleCount]);
  const showLoadMore = hasMore(filteredItems.length);

  const renderItem = useCallback(({ item, index }: { item: FeedItem; index: number }) => {
    if (item.type === "tip") return <TipCard tip={item as Tip} index={index} />;
    return <QuestionCard question={item as Question} index={index} />;
  }, []);

  function handleLoadMore() {
    setLoadingMore(true);
    setTimeout(() => {
      loadMore();
      setLoadingMore(false);
    }, 400);
  }

  const FEED_TABS: { mode: FeedMode; label: string }[] = [
    { mode: "forYou", label: t("forYou") },
    { mode: "following", label: t("followingFeed") },
    { mode: "all", label: t("all") },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, flexDirection: dir }]}>
        <Text style={[styles.logo, { color: colors.primary }]}>{t("appName")}</Text>
        <View style={[styles.headerIcons, { flexDirection: dir }]}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleBellPress} testID="notifications-btn">
            <Animated.View style={{ transform: [{ scale: bellAnim }] }}>
              <Feather name="bell" size={22} color={unreadNotifs > 0 ? colors.primary : colors.foreground} />
            </Animated.View>
            {unreadNotifs > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.accentPink }]}>
                <Text style={styles.badgeText}>{unreadNotifs > 99 ? "99+" : String(unreadNotifs)}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push("/(tabs)/search")} testID="search-btn">
            <Feather name="search" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push("/settings")} testID="settings-btn">
            <Feather name="settings" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.feedTabs, { flexDirection: dir, borderBottomColor: colors.border }]}>
        {FEED_TABS.map(({ mode, label }) => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.feedTab,
              feedMode === mode && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
            ]}
            onPress={() => setFeedMode(mode)}
            testID={`feed-tab-${mode}`}
          >
            <Text style={[styles.feedTabText, { color: feedMode === mode ? colors.primary : colors.mutedForeground }]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={displayItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={displayItems.length > 0}
        ListHeaderComponent={
          feedMode === "all" ? (
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
          ) : null
        }
        ListFooterComponent={
          showLoadMore ? (
            <TouchableOpacity
              style={[styles.loadMoreBtn, { backgroundColor: colors.surface2, borderColor: colors.border }]}
              onPress={handleLoadMore}
              disabled={loadingMore}
              testID="load-more-btn"
            >
              {loadingMore ? (
                <ActivityIndicator size={16} color={colors.primary} />
              ) : (
                <>
                  <Feather name="chevrons-down" size={16} color={colors.primary} />
                  <Text style={[styles.loadMoreText, { color: colors.primary }]}>{t("loadMore")}</Text>
                </>
              )}
            </TouchableOpacity>
          ) : displayItems.length > 0 ? (
            <View style={styles.endOfFeed}>
              <Feather name="check-circle" size={16} color={colors.mutedForeground} />
              <Text style={[styles.endOfFeedText, { color: colors.mutedForeground }]}>{t("noMoreItems")}</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather
              name={feedMode === "following" ? "user-plus" : "inbox"}
              size={36}
              color={colors.mutedForeground}
            />
            <Text style={[styles.emptyText, { color: colors.mutedForeground, textAlign: "center" }]}>
              {feedMode === "following"
                ? t("noFollowing")
                : t("nothingInCategory")}
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
    alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 8,
  },
  logo: { fontSize: 26, fontWeight: "800" as const, letterSpacing: -0.5 },
  headerIcons: { gap: 4 },
  iconBtn: { padding: 8, position: "relative" },
  badge: {
    position: "absolute",
    top: 4, right: 4,
    minWidth: 16, height: 16, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "700" as const },
  feedTabs: { borderBottomWidth: 1, paddingHorizontal: 4 },
  feedTab: {
    flex: 1, alignItems: "center", paddingVertical: 10,
    borderBottomWidth: 2, borderBottomColor: "transparent",
  },
  feedTabText: { fontSize: 14, fontWeight: "600" as const },
  categoriesRow: { marginBottom: 12, marginTop: 4 },
  categories: { paddingHorizontal: 16, gap: 8 },
  pill: { borderRadius: 100, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 6 },
  pillText: { fontSize: 13, fontWeight: "500" as const },
  list: { paddingHorizontal: 16, paddingTop: 8 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12, paddingHorizontal: 32 },
  emptyText: { fontSize: 15 },
  loadMoreBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, borderRadius: 14, borderWidth: 1, paddingVertical: 14,
    marginHorizontal: 16, marginBottom: 8, marginTop: 4,
  },
  loadMoreText: { fontSize: 14, fontWeight: "600" as const },
  endOfFeed: { alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8, paddingVertical: 20 },
  endOfFeedText: { fontSize: 13 },
});
