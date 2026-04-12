import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TipCard from "@/components/TipCard";
import QuestionCard from "@/components/QuestionCard";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useSocial } from "@/context/SocialContext";
import { useToast } from "@/context/ToastContext";
import { FEED_ITEMS, FeedItem, MOCK_USERS, Question, Tip } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";
import { api, ApiUser, ApiPost } from "@/utils/api";

function StatBadge({ value, label, color }: { value: string | number; label: string; color?: string }) {
  const colors = useColors();
  return (
    <View style={[styles.statBadge, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
      <Text style={[styles.statValue, { color: color ?? colors.primary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

export default function UserProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useSettings();
  const { follow, unfollow, isFollowing } = useSocial();
  const { showToast } = useToast();
  const { user: authUser } = useAuth();
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const [apiUser, setApiUser] = useState<ApiUser | null>(null);
  const [apiPosts, setApiPosts] = useState<ApiPost[]>([]);
  const [apiFollowing, setApiFollowing] = useState<boolean | null>(null);

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 180 }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!userId) return;
    api.users.get(userId).then(setApiUser).catch(() => {});
    api.users.getPosts(userId).then(setApiPosts).catch(() => {});
    if (authUser) {
      api.users.isFollowing(authUser.id, userId).then((r) => setApiFollowing(r.following)).catch(() => {});
    }
  }, [userId, authUser?.id]);

  const mockUser = MOCK_USERS.find((u) => u.id === userId);
  const displayUser = apiUser
    ? {
        id: apiUser.id, name: apiUser.name, username: apiUser.username,
        bio: apiUser.bio ?? "", tipsCount: apiUser.tipsCount ?? 0,
        followersCount: apiUser.followersCount ?? 0, followingCount: apiUser.followingCount ?? 0,
        trustScore: apiUser.trustScore ?? 0, avatarGradient: ["#f0e040", "#40e0f0"] as const,
        initials: apiUser.name.slice(0, 2),
      }
    : mockUser;
  const following = apiFollowing !== null ? apiFollowing : (displayUser ? isFollowing(displayUser.id) : false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const dir = isRTL ? "row-reverse" : "row";

  const userTips: FeedItem[] = FEED_ITEMS.filter((item) => item.userId === userId);

  if (!displayUser) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.navBar, { paddingTop: topPad + 8, borderBottomColor: colors.border, flexDirection: dir }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="back-btn">
            <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: colors.foreground }]}>{t("profile")}</Text>
        </View>
        <View style={styles.notFound}>
          <Feather name="user-x" size={48} color={colors.mutedForeground} />
          <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>{t("userNotFound")}</Text>
        </View>
      </View>
    );
  }

  function handleFollow() {
    if (authUser && userId) {
      api.users.follow(userId, authUser.id)
        .then((r) => setApiFollowing(r.following))
        .catch(() => {});
    }
    if (following) {
      unfollow(displayUser!.id);
      showToast(t("toastUnfollowed"), "info", "user-minus");
    } else {
      follow(displayUser!.id);
      showToast(t("toastFollowing"), "success", "user-plus");
    }
  }

  const categoryIcons: Record<string, string> = {
    home: "home", food: "coffee", business: "briefcase",
    health: "heart", tech: "cpu", nature: "sun",
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.navBar, { paddingTop: topPad + 8, borderBottomColor: colors.border, flexDirection: dir }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="back-btn">
          <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.foreground }]}>{displayUser.name}</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={userTips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          if (item.type === "tip") return <TipCard tip={item as Tip} index={index} />;
          return <QuestionCard question={item as Question} index={index} />;
        }}
        ListHeaderComponent={
          <Animated.View style={{ opacity: headerFade, transform: [{ translateY: headerSlide }] }}>
            <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.avatarWrap, { backgroundColor: Array.isArray(displayUser.avatarGradient) ? displayUser.avatarGradient[0] : "#f0e040" }]}>
                <Text style={styles.avatarText}>{displayUser.initials}</Text>
              </View>

              <Text style={[styles.name, { color: colors.foreground }]}>{displayUser.name}</Text>
              <Text style={[styles.username, { color: colors.mutedForeground }]}>{displayUser.username}</Text>

              {displayUser.bio ? (
                <Text style={[styles.bio, { color: "#a0a0c0", textAlign: "center" }]}>{displayUser.bio}</Text>
              ) : null}

              <View style={[styles.categoryBadge, { backgroundColor: "rgba(64,224,64,0.10)", borderColor: "rgba(64,224,64,0.3)", flexDirection: dir }]}>
                <Feather name={(categoryIcons[(displayUser as any).categoryId] ?? "grid") as any} size={12} color={colors.accentGreen} />
                <Text style={[styles.categoryText, { color: colors.accentGreen }]}>
                  {displayUser.trustScore}% · {t("verifiedExpert")}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.followBtn,
                  { flexDirection: dir },
                  {
                    backgroundColor: following ? "transparent" : colors.primary,
                    borderColor: following ? colors.border : colors.primary,
                  },
                ]}
                onPress={handleFollow}
                testID="follow-user-btn"
              >
                <Feather
                  name={following ? "user-check" : "user-plus"}
                  size={16}
                  color={following ? colors.mutedForeground : colors.primaryForeground}
                />
                <Text style={[styles.followBtnText, { color: following ? colors.mutedForeground : colors.primaryForeground }]}>
                  {following ? t("unfollow") : t("follow")}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.statsRow, { flexDirection: dir }]}>
              <StatBadge value={displayUser.tipsCount} label={t("tips")} />
              <StatBadge value={displayUser.followersCount.toLocaleString()} label={t("followers")} color={colors.accentCyan} />
              <StatBadge value={displayUser.followingCount} label={t("whoIFollow")} color={colors.accentPink} />
            </View>

            {userTips.length > 0 && (
              <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
                {t("tipsByUser")} · {userTips.length}
              </Text>
            )}
          </Animated.View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={36} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground, textAlign: "center" }]}>
              {t("noTips")}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: {
    alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  navTitle: { fontSize: 18, fontWeight: "700" as const, flex: 1, textAlign: "center" },
  profileCard: {
    alignItems: "center", borderRadius: 20, borderWidth: 1,
    margin: 16, padding: 24, gap: 10,
  },
  avatarWrap: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  avatarText: { fontSize: 28, fontWeight: "700" as const, color: "#0a0a0f" },
  name: { fontSize: 22, fontWeight: "800" as const },
  username: { fontSize: 14 },
  bio: { fontSize: 14, lineHeight: 20, paddingHorizontal: 12 },
  categoryBadge: {
    alignItems: "center", borderRadius: 100, paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, gap: 6, marginTop: 4,
  },
  categoryText: { fontSize: 12, fontWeight: "600" as const },
  followBtn: {
    alignItems: "center", borderRadius: 14, paddingHorizontal: 28, paddingVertical: 12,
    borderWidth: 1, gap: 8, marginTop: 8,
  },
  followBtnText: { fontSize: 15, fontWeight: "700" as const },
  statsRow: { gap: 10, paddingHorizontal: 16, marginBottom: 4 },
  statBadge: {
    flex: 1, alignItems: "center", borderRadius: 14,
    borderWidth: 1, paddingVertical: 14, gap: 4,
  },
  statValue: { fontSize: 20, fontWeight: "800" as const },
  statLabel: { fontSize: 12 },
  sectionTitle: {
    fontSize: 11, fontWeight: "600" as const, letterSpacing: 1,
    textTransform: "uppercase", marginHorizontal: 16, marginBottom: 4, marginTop: 12,
  },
  listContent: { paddingHorizontal: 16, paddingTop: 0 },
  empty: { alignItems: "center", paddingTop: 32, gap: 12 },
  emptyText: { fontSize: 15 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  notFoundText: { fontSize: 16 },
});
