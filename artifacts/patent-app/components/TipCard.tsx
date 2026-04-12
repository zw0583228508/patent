import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useFeed } from "@/context/FeedContext";
import { Tip } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

type Props = { tip: Tip };

export default function TipCard({ tip }: Props) {
  const colors = useColors();
  const { votes, savedIds, vote, toggleSave } = useFeed();
  const myVote = votes[tip.id];
  const saved = savedIds.has(tip.id);
  const scaleWorked = React.useRef(new Animated.Value(1)).current;
  const scaleNot = React.useRef(new Animated.Value(1)).current;

  function animatePress(anim: Animated.Value) {
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  }

  function handleVote(v: "worked" | "didnt") {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    animatePress(v === "worked" ? scaleWorked : scaleNot);
    vote(tip.id, v);
  }

  const workedCount = tip.workedCount + (myVote === "worked" ? 1 : 0);
  const didntCount = tip.didntWorkCount + (myVote === "didnt" ? 1 : 0);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]} testID={`tip-card-${tip.id}`}>
      {tip.isTrending && (
        <View style={[styles.trendingBadge, { backgroundColor: "rgba(240,224,64,0.12)", borderColor: "rgba(240,224,64,0.3)" }]}>
          <Feather name="trending-up" size={10} color={colors.primary} />
          <Text style={[styles.trendingText, { color: colors.primary }]}>טרנד</Text>
        </View>
      )}

      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: tip.avatarGradient[0] }]}>
          <Text style={styles.avatarText}>{tip.initials}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={[styles.author, { color: colors.foreground }]}>{tip.author}</Text>
          <View style={styles.catRow}>
            <Feather name={tip.categoryIcon as any} size={10} color={colors.mutedForeground} />
            <Text style={[styles.category, { color: colors.mutedForeground }]}> {tip.category}</Text>
          </View>
        </View>
        <View style={[styles.trustBadge, { backgroundColor: "rgba(64,224,64,0.12)", borderColor: "rgba(64,224,64,0.3)" }]}>
          <Text style={[styles.trustText, { color: colors.accentGreen }]}>{tip.trustScore}%</Text>
        </View>
      </View>

      <Text style={[styles.tipText, { color: "#c0c0d8" }]}>{tip.text}</Text>

      <View style={styles.actions}>
        <Animated.View style={{ flex: 1, transform: [{ scale: scaleWorked }] }}>
          <TouchableOpacity
            style={[
              styles.voteBtn,
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
              עבד לי ({formatCount(workedCount)})
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ flex: 1, transform: [{ scale: scaleNot }] }}>
          <TouchableOpacity
            style={[
              styles.voteBtn,
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
              לא עבד ({formatCount(didntCount)})
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => toggleSave(tip.id)}
          testID={`save-${tip.id}`}
        >
          <Feather name={saved ? "bookmark" : "bookmark"} size={16} color={saved ? colors.primary : colors.mutedForeground} />
        </TouchableOpacity>

        <View style={styles.commentRow}>
          <Feather name="message-circle" size={14} color={colors.mutedForeground} />
          <Text style={[styles.commentCount, { color: colors.mutedForeground }]}>{tip.commentCount}</Text>
        </View>
      </View>

      <Text style={[styles.timestamp, { color: "#4a4a6a" }]}>{tip.timestamp}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 10,
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
    alignItems: "flex-end",
  },
  author: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  catRow: {
    flexDirection: "row-reverse",
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
    flexDirection: "row-reverse",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    marginBottom: 8,
    gap: 4,
  },
  trendingText: {
    fontSize: 10,
    fontWeight: "600" as const,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: "right",
  },
  actions: {
    flexDirection: "row-reverse",
    gap: 8,
    alignItems: "center",
  },
  voteBtn: {
    flexDirection: "row-reverse",
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
  iconBtn: {
    padding: 4,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  commentCount: {
    fontSize: 12,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 8,
    textAlign: "right",
  },
});
