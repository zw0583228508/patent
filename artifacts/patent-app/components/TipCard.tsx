import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CommentsSheet from "@/components/CommentsSheet";
import TranslateButton from "@/components/TranslateButton";
import { useFeed } from "@/context/FeedContext";
import { useSettings } from "@/context/SettingsContext";
import { Tip } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

type Props = { tip: Tip };

export default function TipCard({ tip }: Props) {
  const colors = useColors();
  const { t, isRTL } = useSettings();
  const { votes, savedIds, likedIds, comments, vote, toggleSave, toggleLike } = useFeed();
  const myVote = votes[tip.id];
  const saved = savedIds.has(tip.id);
  const liked = likedIds.has(tip.id);
  const [showComments, setShowComments] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);

  const scaleWorked = React.useRef(new Animated.Value(1)).current;
  const scaleNot = React.useRef(new Animated.Value(1)).current;
  const scaleLike = React.useRef(new Animated.Value(1)).current;

  const dir = isRTL ? "row-reverse" : "row";
  const textAlign = isRTL ? "right" : "left";
  const alignSelf = isRTL ? "flex-start" : "flex-end";

  function animatePress(anim: Animated.Value) {
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.88, duration: 70, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }

  function handleVote(v: "worked" | "didnt") {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    animatePress(v === "worked" ? scaleWorked : scaleNot);
    vote(tip.id, v);
  }

  function handleLike() {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    animatePress(scaleLike);
    toggleLike(tip.id);
  }

  const workedCount = tip.workedCount + (myVote === "worked" ? 1 : 0);
  const didntCount = tip.didntWorkCount + (myVote === "didnt" ? 1 : 0);
  const likeCount = tip.likeCount + (liked ? 1 : 0);
  const commentCount = (comments[tip.id] ?? []).length || tip.commentCount;

  return (
    <>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]} testID={`tip-card-${tip.id}`}>
        {tip.isTrending && (
          <View style={[styles.trendingBadge, { backgroundColor: "rgba(240,224,64,0.12)", borderColor: "rgba(240,224,64,0.3)", flexDirection: dir, alignSelf }]}>
            <Feather name="trending-up" size={10} color={colors.primary} />
            <Text style={[styles.trendingText, { color: colors.primary }]}>{t("trending")}</Text>
          </View>
        )}

        <View style={[styles.header, { flexDirection: dir }]}>
          <View style={[styles.avatar, { backgroundColor: tip.avatarGradient[0] }]}>
            <Text style={styles.avatarText}>{tip.initials}</Text>
          </View>
          <View style={[styles.meta, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
            <Text style={[styles.author, { color: colors.foreground }]}>{tip.author}</Text>
            <View style={[styles.catRow, { flexDirection: dir }]}>
              <Feather name={tip.categoryIcon as any} size={10} color={colors.mutedForeground} />
              <Text style={[styles.category, { color: colors.mutedForeground }]}> {tip.category}</Text>
            </View>
          </View>
          <View style={[styles.trustBadge, { backgroundColor: "rgba(64,224,64,0.12)", borderColor: "rgba(64,224,64,0.3)" }]}>
            <Text style={[styles.trustText, { color: colors.accentGreen }]}>{tip.trustScore}%</Text>
          </View>
        </View>

        <Text style={[styles.tipText, { color: "#c0c0d8", textAlign }]}>
          {translatedText ?? tip.text}
        </Text>

        <TranslateButton
          text={tip.text}
          isTranslated={translatedText !== null}
          onTranslated={setTranslatedText}
        />

        <View style={[styles.voteRow, { flexDirection: dir }]}>
          <Animated.View style={{ flex: 1, transform: [{ scale: scaleWorked }] }}>
            <TouchableOpacity
              style={[
                styles.voteBtn,
                { flexDirection: dir },
                {
                  backgroundColor: myVote === "worked" ? "rgba(64,224,64,0.22)" : "rgba(64,224,64,0.10)",
                  borderColor: myVote === "worked" ? "rgba(64,224,64,0.6)" : "rgba(64,224,64,0.25)",
                },
              ]}
              onPress={() => handleVote("worked")}
              testID={`vote-worked-${tip.id}`}
            >
              <Feather name="check" size={12} color={colors.accentGreen} />
              <Text style={[styles.voteBtnText, { color: colors.accentGreen }]}>
                {t("workedForMe")} ({formatCount(workedCount)})
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ flex: 1, transform: [{ scale: scaleNot }] }}>
            <TouchableOpacity
              style={[
                styles.voteBtn,
                { flexDirection: dir },
                {
                  backgroundColor: myVote === "didnt" ? "rgba(240,64,64,0.2)" : "rgba(240,64,64,0.08)",
                  borderColor: myVote === "didnt" ? "rgba(240,64,64,0.6)" : "rgba(240,64,64,0.2)",
                },
              ]}
              onPress={() => handleVote("didnt")}
              testID={`vote-didnt-${tip.id}`}
            >
              <Feather name="x" size={12} color={colors.accentRed} />
              <Text style={[styles.voteBtnText, { color: colors.accentRed }]}>
                {t("didntWork")} ({formatCount(didntCount)})
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={[styles.actionsRow, { flexDirection: dir }]}>
          <Animated.View style={{ transform: [{ scale: scaleLike }] }}>
            <TouchableOpacity
              style={[styles.actionBtn, { flexDirection: dir }]}
              onPress={handleLike}
              testID={`like-${tip.id}`}
            >
              <Feather name="heart" size={16} color={liked ? colors.accentPink : colors.mutedForeground} />
              <Text style={[styles.actionCount, { color: liked ? colors.accentPink : colors.mutedForeground }]}>
                {formatCount(likeCount)}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={[styles.actionBtn, { flexDirection: dir }]}
            onPress={() => setShowComments(true)}
            testID={`comments-${tip.id}`}
          >
            <Feather name="message-circle" size={16} color={colors.mutedForeground} />
            <Text style={[styles.actionCount, { color: colors.mutedForeground }]}>{commentCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => toggleSave(tip.id)}
            testID={`save-${tip.id}`}
          >
            <Feather name="bookmark" size={16} color={saved ? colors.primary : colors.mutedForeground} />
          </TouchableOpacity>

          <Text style={[styles.timestamp, { color: "#4a4a6a", marginStart: "auto" }]}>{tip.timestamp}</Text>
        </View>
      </View>

      <CommentsSheet
        visible={showComments}
        itemId={tip.id}
        itemText={tip.text}
        onClose={() => setShowComments(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    gap: 10,
  },
  header: {
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#0a0a0f",
  },
  meta: {
    flex: 1,
  },
  author: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  catRow: {
    alignItems: "center",
    marginTop: 2,
  },
  category: {
    fontSize: 10,
  },
  trustBadge: {
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  trustText: {
    fontSize: 10,
    fontWeight: "600" as const,
  },
  trendingBadge: {
    alignItems: "center",
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    gap: 4,
  },
  trendingText: {
    fontSize: 10,
    fontWeight: "600" as const,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 20,
  },
  voteRow: {
    gap: 8,
  },
  voteBtn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 7,
    borderWidth: 1,
    gap: 4,
  },
  voteBtnText: {
    fontSize: 11,
    fontWeight: "500" as const,
  },
  actionsRow: {
    alignItems: "center",
    gap: 16,
  },
  actionBtn: {
    alignItems: "center",
    gap: 4,
  },
  actionCount: {
    fontSize: 13,
  },
  timestamp: {
    fontSize: 10,
  },
});
