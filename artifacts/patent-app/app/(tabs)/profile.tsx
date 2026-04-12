import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TipCard from "@/components/TipCard";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useSocial } from "@/context/SocialContext";
import { FEED_ITEMS, MOCK_USERS, MockUser, Tip, USER_PROFILE, USER_TIPS } from "@/data/mockData";
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

function UserRow({ user, onFollow }: { user: MockUser; onFollow: (id: string) => void }) {
  const colors = useColors();
  const { t, isRTL } = useSettings();
  const { isFollowing, follow, unfollow } = useSocial();
  const following = isFollowing(user.id);
  const dir = isRTL ? "row-reverse" : "row";

  return (
    <View style={[styles.userRow, { borderBottomColor: colors.border, flexDirection: dir }]}>
      <View style={[styles.userAvatar, { backgroundColor: user.avatarGradient[0] }]}>
        <Text style={styles.userAvatarText}>{user.initials}</Text>
      </View>
      <View style={[styles.userInfo, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
        <Text style={[styles.userName, { color: colors.foreground }]}>{user.name}</Text>
        <Text style={[styles.userHandle, { color: colors.mutedForeground }]}>{user.username}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.followBtn,
          {
            backgroundColor: following ? "transparent" : colors.primary,
            borderColor: following ? colors.border : colors.primary,
          },
        ]}
        onPress={() => following ? unfollow(user.id) : follow(user.id)}
        testID={`follow-${user.id}`}
      >
        <Text style={[styles.followBtnText, { color: following ? colors.mutedForeground : colors.primaryForeground }]}>
          {following ? t("unfollow") : t("follow")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const SAVED_TIPS = FEED_ITEMS.filter((item): item is Tip => item.type === "tip").slice(0, 3);

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useSettings();
  const { followedUsers } = useSocial();
  const { user: authUser, isLoggedIn, logout, setShowLoginModal } = useAuth();
  const [tab, setTab] = useState<"tips" | "saved" | "following" | "followers">("tips");
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const dir = isRTL ? "row-reverse" : "row";

  const followingList = MOCK_USERS.filter((u) => followedUsers.has(u.id));
  const followersList = MOCK_USERS.slice(0, 5);

  const tabData = tab === "tips" ? USER_TIPS : tab === "saved" ? SAVED_TIPS : [];

  const TABS = [
    { id: "tips", label: t("myTips") },
    { id: "saved", label: t("saved") },
    { id: "following", label: t("whoIFollow") },
    { id: "followers", label: t("followers") },
  ] as const;

  const followersCount = USER_PROFILE.followersCount;
  const followingCount = followedUsers.size + USER_PROFILE.followingCount;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={tab === "tips" || tab === "saved" ? tabData : []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TipCard tip={item} />}
        contentContainerStyle={[styles.listContent, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={[styles.header, { paddingTop: topPad + 8 }]}>
              <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t("profile")}</Text>
            </View>

            <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {isLoggedIn && authUser ? (
                <>
                  <View style={[styles.avatarLarge, { backgroundColor: authUser.avatarColor }]}>
                    <Text style={styles.avatarLargeText}>{authUser.initials}</Text>
                  </View>
                  <Text style={[styles.name, { color: colors.foreground }]}>{authUser.name}</Text>
                  <Text style={[styles.username, { color: colors.mutedForeground }]}>{authUser.email}</Text>
                  <TouchableOpacity
                    style={[styles.logoutBtn, { borderColor: colors.border }]}
                    onPress={logout}
                    testID="logout-btn"
                  >
                    <Feather name="log-out" size={14} color={colors.mutedForeground} />
                    <Text style={[styles.logoutText, { color: colors.mutedForeground }]}>{t("logOut")}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
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
                  <TouchableOpacity
                    style={[styles.signInBtn, { backgroundColor: colors.primary }]}
                    onPress={() => setShowLoginModal(true)}
                    testID="profile-sign-in"
                  >
                    <Feather name="log-in" size={15} color={colors.primaryForeground} />
                    <Text style={[styles.signInBtnText, { color: colors.primaryForeground }]}>{t("signIn")}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <View style={[styles.statsRow, { flexDirection: dir }]}>
              <StatCard label={t("tips")} value={USER_PROFILE.tipsCount} />
              <StatCard label={t("followers")} value={followersCount} color={colors.accentCyan} />
              <StatCard label={t("whoIFollow")} value={followingCount} color={colors.accentPink} />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tabsScroll}
              contentContainerStyle={[styles.tabs, { flexDirection: dir }]}
            >
              {TABS.map(({ id, label }) => (
                <TouchableOpacity
                  key={id}
                  style={[styles.tabBtn, tab === id && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
                  onPress={() => setTab(id)}
                  testID={`tab-${id}`}
                >
                  <Text style={[styles.tabBtnText, { color: tab === id ? colors.primary : colors.mutedForeground }]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {(tab === "following" || tab === "followers") && (
              <View style={styles.userListContainer}>
                {(tab === "following" ? followingList : followersList).map((user) => (
                  <UserRow key={user.id} user={user} onFollow={() => {}} />
                ))}
                {tab === "following" && followingList.length === 0 && (
                  <View style={styles.emptySection}>
                    <Feather name="user-plus" size={32} color={colors.mutedForeground} />
                    <Text style={[styles.emptyText, { color: colors.mutedForeground, textAlign: "center" }]}>
                      {t("noFollowing")}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          tab === "tips" || tab === "saved" ? (
            <View style={styles.empty}>
              <Feather name="bookmark" size={36} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                {tab === "saved" ? t("noSaved") : t("noTips")}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: "#1c1c27",
  },
  headerTitle: { fontSize: 22, fontWeight: "800" as const },
  profileCard: {
    alignItems: "center", borderWidth: 1, borderRadius: 20,
    margin: 16, padding: 24, gap: 8,
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
  tabsScroll: { borderBottomWidth: 1, borderBottomColor: "#1c1c27" },
  tabs: { paddingHorizontal: 16, marginBottom: 0 },
  tabBtn: {
    paddingHorizontal: 12, paddingVertical: 12,
    borderBottomWidth: 2, borderBottomColor: "transparent",
  },
  tabBtnText: { fontSize: 13, fontWeight: "600" as const },
  listContent: { paddingHorizontal: 16 },
  empty: { alignItems: "center", paddingTop: 40, gap: 12 },
  emptyText: { fontSize: 15, paddingHorizontal: 20 },
  userListContainer: { paddingHorizontal: 16, paddingTop: 8 },
  userRow: {
    alignItems: "center", gap: 12, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  userAvatar: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  userAvatarText: { fontSize: 13, fontWeight: "700" as const, color: "#0a0a0f" },
  userInfo: { flex: 1, gap: 2 },
  userName: { fontSize: 14, fontWeight: "600" as const },
  userHandle: { fontSize: 12 },
  followBtn: {
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7,
    borderWidth: 1, flexShrink: 0,
  },
  followBtnText: { fontSize: 13, fontWeight: "600" as const },
  emptySection: { alignItems: "center", paddingVertical: 40, gap: 12 },
  signInBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8,
  },
  signInBtnText: { fontSize: 15, fontWeight: "700" as const },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderRadius: 12, paddingHorizontal: 18, paddingVertical: 9,
    borderWidth: 1, marginTop: 8,
  },
  logoutText: { fontSize: 13, fontWeight: "600" as const },
});
