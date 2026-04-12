import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CommentsSheet from "@/components/CommentsSheet";
import TranslateButton from "@/components/TranslateButton";
import { useAuth } from "@/context/AuthContext";
import { useFeed } from "@/context/FeedContext";
import { useSettings } from "@/context/SettingsContext";
import { useSocial } from "@/context/SocialContext";
import { useToast } from "@/context/ToastContext";
import { Question } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

type Props = { question: Question; index?: number };

export default function QuestionCard({ question, index = 0 }: Props) {
  const colors = useColors();
  const { t, isRTL } = useSettings();
  const { likedIds, repostedIds, comments, toggleLike, toggleRepost } = useFeed();
  const { follow, unfollow, isFollowing } = useSocial();
  const { requireAuth } = useAuth();
  const { showToast } = useToast();
  const originalId = question.id.startsWith("repost_") ? question.id.slice(7) : question.id;
  const liked = likedIds.has(question.id);
  const reposted = repostedIds.has(originalId) || question.repostedBy === "אני";
  const following = isFollowing(question.userId);
  const isMyQuestion = question.userId === "me";
  const [showComments, setShowComments] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(16)).current;
  const scaleLike = React.useRef(new Animated.Value(1)).current;

  const dir = isRTL ? "row-reverse" : "row";
  const textAlign = isRTL ? "right" : "left";
  const alignSelf = isRTL ? "flex-end" : "flex-start";

  useEffect(() => {
    const delay = Math.min(index * 60, 300);
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 220 }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  function handleFollow() {
    requireAuth(() => {
      if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (following) { unfollow(question.userId); showToast(t("toastUnfollowed"), "info", "user-minus"); }
      else { follow(question.userId); showToast(t("toastFollowing"), "success", "user-plus"); }
    });
  }

  function handleLike() {
    requireAuth(() => {
      if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Animated.sequence([
        Animated.timing(scaleLike, { toValue: 0.85, duration: 70, useNativeDriver: true }),
        Animated.spring(scaleLike, { toValue: 1, useNativeDriver: true }),
      ]).start();
      toggleLike(question.id);
      showToast(liked ? t("toastUnliked") : t("toastLiked"), "success", "heart");
    });
  }

  function handleRepost() {
    requireAuth(() => {
      if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      toggleRepost(question);
      showToast(reposted ? t("toastUnreposted") : t("toastReposted"), "success", "repeat");
    });
  }

  async function handleShare() {
    try {
      await Share.share({ message: question.text, title: "Patent — " + question.category });
    } catch {}
  }

  function handleAuthorPress() {
    if (question.userId === "me") router.push("/(tabs)/profile");
    else router.push(`/profile/${question.userId}` as any);
  }

  const likeCount = question.likeCount + (liked ? 1 : 0);
  const commentCount = (comments[question.id] ?? []).length || question.answerCount;
  const repostCount = (question.repostCount ?? 0) + (reposted ? 1 : 0);

  return (
    <>
      {question.repostedBy && (
        <View style={[styles.repostBanner, { flexDirection: dir }]}>
          <Feather name="repeat" size={11} color={colors.accentGreen} />
          <Text style={[styles.repostBannerText, { color: colors.accentGreen }]}>
            {question.repostedBy === "אני" ? t("youReposted") : `${question.repostedBy} ${t("reposted")}`}
          </Text>
        </View>
      )}
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: question.repostedBy ? "rgba(64,224,64,0.2)" : "rgba(64,224,240,0.2)" },
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
        testID={`question-card-${question.id}`}
      >
        <View style={[styles.qLabel, { backgroundColor: "rgba(64,224,240,0.1)", flexDirection: dir, alignSelf }]}>
          <Feather name="help-circle" size={10} color={colors.accentCyan} />
          <Text style={[styles.qLabelText, { color: colors.accentCyan }]}>{t("lookingForSolution")}</Text>
        </View>

        <View style={[styles.header, { flexDirection: dir }]}>
          <TouchableOpacity onPress={handleAuthorPress} activeOpacity={0.7}>
            <View style={[styles.avatar, { backgroundColor: question.avatarGradient[0] }]}>
              <Text style={styles.avatarText}>{question.initials}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.meta, { alignItems: isRTL ? "flex-end" : "flex-start" }]} onPress={handleAuthorPress} activeOpacity={0.7}>
            <Text style={[styles.author, { color: colors.foreground }]}>{question.author}</Text>
            <View style={[styles.catRow, { flexDirection: dir }]}>
              <Feather name={question.categoryIcon as any} size={10} color={colors.mutedForeground} />
              <Text style={[styles.category, { color: colors.mutedForeground }]}> {question.category}</Text>
            </View>
          </TouchableOpacity>
          {!isMyQuestion && (
            <TouchableOpacity
              style={[
                styles.followBtn,
                {
                  backgroundColor: following ? "transparent" : "rgba(64,224,240,0.10)",
                  borderColor: following ? colors.border : "rgba(64,224,240,0.4)",
                },
              ]}
              onPress={handleFollow}
              testID={`follow-author-${question.id}`}
            >
              <Feather name={following ? "user-check" : "user-plus"} size={10} color={following ? colors.mutedForeground : colors.accentCyan} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={[styles.qText, { color: "#c0c0d8", textAlign }]}>
          {translatedText ?? question.text}
        </Text>

        <TranslateButton
          text={question.text}
          isTranslated={translatedText !== null}
          onTranslated={setTranslatedText}
        />

        <View style={[styles.footer, { flexDirection: dir }]}>
          <TouchableOpacity
            style={[
              styles.answerBtn,
              { flexDirection: dir },
              { backgroundColor: "rgba(64,224,240,0.1)", borderColor: "rgba(64,224,240,0.3)" },
            ]}
            onPress={() => setShowComments(true)}
            testID={`answer-btn-${question.id}`}
          >
            <Feather name="edit-3" size={12} color={colors.accentCyan} />
            <Text style={[styles.answerBtnText, { color: colors.accentCyan }]}>
              {t("answer")} · {commentCount}
            </Text>
          </TouchableOpacity>

          <View style={[styles.rightActions, { flexDirection: dir }]}>
            <Animated.View style={{ transform: [{ scale: scaleLike }] }}>
              <TouchableOpacity
                style={[styles.actionBtn, { flexDirection: dir }]}
                onPress={handleLike}
                testID={`like-question-${question.id}`}
              >
                <Feather name="heart" size={15} color={liked ? colors.accentPink : colors.mutedForeground} />
                <Text style={[styles.actionCount, { color: liked ? colors.accentPink : colors.mutedForeground }]}>
                  {formatCount(likeCount)}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={[styles.actionBtn, { flexDirection: dir }]}
              onPress={handleRepost}
              testID={`repost-question-${question.id}`}
            >
              <Feather name="repeat" size={15} color={reposted ? colors.accentGreen : colors.mutedForeground} />
              {repostCount > 0 && (
                <Text style={[styles.actionCount, { color: reposted ? colors.accentGreen : colors.mutedForeground }]}>
                  {repostCount}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={handleShare} testID={`share-question-${question.id}`}>
              <Feather name="share-2" size={15} color={colors.mutedForeground} />
            </TouchableOpacity>

            <Text style={[styles.timestamp, { color: "#4a4a6a" }]}>{question.timestamp}</Text>
          </View>
        </View>
      </Animated.View>

      <CommentsSheet
        visible={showComments}
        itemId={question.id}
        itemText={question.text}
        isQuestion
        onClose={() => setShowComments(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 10, gap: 10 },
  qLabel: {
    alignItems: "center", borderRadius: 100, paddingHorizontal: 8, paddingVertical: 3, gap: 4,
  },
  qLabelText: { fontSize: 9, letterSpacing: 1, fontWeight: "600" as const, textTransform: "uppercase" },
  header: { alignItems: "center", gap: 10 },
  followBtn: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 1,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 11, fontWeight: "700" as const, color: "#0a0a0f" },
  meta: { flex: 1 },
  author: { fontSize: 12, fontWeight: "600" as const },
  catRow: { alignItems: "center", marginTop: 2 },
  category: { fontSize: 10 },
  qText: { fontSize: 13, lineHeight: 20 },
  footer: { alignItems: "center", justifyContent: "space-between" },
  answerBtn: {
    alignItems: "center", borderRadius: 8, paddingVertical: 7,
    paddingHorizontal: 12, borderWidth: 1, gap: 6,
  },
  answerBtnText: { fontSize: 11, fontWeight: "500" as const },
  rightActions: { alignItems: "center", gap: 12 },
  actionBtn: { alignItems: "center", gap: 4 },
  actionCount: { fontSize: 13 },
  timestamp: { fontSize: 10 },
  repostBanner: {
    alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 5,
    borderTopLeftRadius: 10, borderTopRightRadius: 10,
    backgroundColor: "rgba(64,224,64,0.08)", marginBottom: -6,
  },
  repostBannerText: { fontSize: 11, fontWeight: "500" as const },
});
