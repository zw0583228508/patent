import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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

import { useSettings } from "@/context/SettingsContext";
import { useColors } from "@/hooks/useColors";
import { ApiCollection, ApiCollectionPost, ApiPost, api } from "@/utils/api";
import { Tip } from "@/data/mockData";
import TipCard from "@/components/TipCard";

function apiPostToTip(p: ApiPost, author: ApiCollectionPost["author"]): Tip {
  return {
    id: p.id,
    type: p.type as "tip" | "question",
    text: p.content || p.title,
    author: author.name,
    userId: author.id,
    category: p.categoryId,
    categoryIcon: "tag",
    timestamp: new Date(p.createdAt).toLocaleDateString("he-IL"),
    initials: author.name.slice(0, 2).toUpperCase(),
    avatarGradient: [author.avatarGradient ?? "#f0e040", "#1c1c27"],
    trustScore: author.trustScore ?? 0,
    workedCount: p.upvotesCount ?? 0,
    didntWorkCount: p.downvotesCount ?? 0,
    likeCount: p.likesCount ?? 0,
    commentCount: p.commentsCount ?? 0,
    repostCount: 0,
    isTrending: p.isTrending ?? false,
  };
}

export default function CollectionDetailScreen() {
  const colors = useColors();
  const { t, isRTL } = useSettings();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [collection, setCollection] = useState<ApiCollection | null>(null);
  const [posts, setPosts] = useState<ApiCollectionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const LIMIT = 20;

  const dir = isRTL ? "row-reverse" : "row";

  const load = useCallback(async (reset = false) => {
    if (!id) return;
    try {
      const res = await api.collections.getPosts(id, { limit: LIMIT, offset: reset ? 0 : offset });
      setCollection(res.collection);
      if (reset) {
        setPosts(res.data);
        setOffset(res.data.length);
      } else {
        setPosts((p) => [...p, ...res.data]);
        setOffset((o) => o + res.data.length);
      }
      setHasMore(res.hasMore);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [id, offset]);

  useEffect(() => { load(true); }, [id]);

  function refresh() {
    setRefreshing(true);
    setOffset(0);
    load(true);
  }

  function loadMore() {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    load();
  }

  const tips = posts.map((p, i) => apiPostToTip(p.post, p.author));

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={[styles.topBar, { flexDirection: dir, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>
        <ActivityIndicator color={colors.primary} style={{ marginTop: 80 }} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.topBar, { flexDirection: dir, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} testID="back-btn">
          <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={24} color={colors.foreground} />
        </TouchableOpacity>
        {collection && (
          <View style={[styles.titleArea, { flexDirection: dir }]}>
            <View style={[styles.colIcon, { backgroundColor: collection.color + "20", borderColor: collection.color + "40" }]}>
              <Feather name={collection.icon as any} size={16} color={collection.color} />
            </View>
            <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
              {collection.name}
            </Text>
          </View>
        )}
        {collection && (
          <View style={[styles.countBadge, { backgroundColor: collection.color + "20", borderColor: collection.color + "40" }]}>
            <Text style={[styles.countText, { color: collection.color }]}>{collection.postsCount}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={tips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: insets.bottom + 80 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{t("collectionEmpty")}</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t("saveToCollection")}</Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} /> : null
        }
        renderItem={({ item, index }) => <TipCard tip={item} index={index} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  titleArea: { flex: 1, alignItems: "center", gap: 8 },
  colIcon: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 1, alignItems: "center", justifyContent: "center",
  },
  title: { fontSize: 16, fontWeight: "700", flexShrink: 1 },
  countBadge: {
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1,
  },
  countText: { fontSize: 12, fontWeight: "700" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptyText: { fontSize: 14, textAlign: "center" },
});
