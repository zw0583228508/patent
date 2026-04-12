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
import { useFeed } from "@/context/FeedContext";
import { Question } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

type Props = { question: Question };

export default function QuestionCard({ question }: Props) {
  const colors = useColors();
  const { likedIds, comments, toggleLike } = useFeed();
  const liked = likedIds.has(question.id);
  const [showComments, setShowComments] = useState(false);
  const scaleLike = React.useRef(new Animated.Value(1)).current;

  function handleLike() {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(scaleLike, { toValue: 0.85, duration: 70, useNativeDriver: true }),
      Animated.spring(scaleLike, { toValue: 1, useNativeDriver: true }),
    ]).start();
    toggleLike(question.id);
  }

  const likeCount = question.likeCount + (liked ? 1 : 0);
  const commentCount = (comments[question.id] ?? []).length || question.answerCount;

  return (
    <>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: "rgba(64,224,240,0.2)",
          },
        ]}
        testID={`question-card-${question.id}`}
      >
        <View style={[styles.qLabel, { backgroundColor: "rgba(64,224,240,0.1)" }]}>
          <Feather name="help-circle" size={10} color={colors.accentCyan} />
          <Text style={[styles.qLabelText, { color: colors.accentCyan }]}>מחפש פתרון</Text>
        </View>

        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: question.avatarGradient[0] }]}>
            <Text style={styles.avatarText}>{question.initials}</Text>
          </View>
          <View style={styles.meta}>
            <Text style={[styles.author, { color: colors.foreground }]}>{question.author}</Text>
            <View style={styles.catRow}>
              <Feather name={question.categoryIcon as any} size={10} color={colors.mutedForeground} />
              <Text style={[styles.category, { color: colors.mutedForeground }]}> {question.category}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.qText, { color: "#c0c0d8" }]}>{question.text}</Text>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.answerBtn,
              {
                backgroundColor: "rgba(64,224,240,0.1)",
                borderColor: "rgba(64,224,240,0.3)",
              },
            ]}
            onPress={() => setShowComments(true)}
            testID={`answer-btn-${question.id}`}
          >
            <Feather name="edit-3" size={12} color={colors.accentCyan} />
            <Text style={[styles.answerBtnText, { color: colors.accentCyan }]}>
              ענה · {commentCount}
            </Text>
          </TouchableOpacity>

          <View style={styles.rightActions}>
            <Animated.View style={{ transform: [{ scale: scaleLike }] }}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleLike}
                testID={`like-question-${question.id}`}
              >
                <Feather name="heart" size={15} color={liked ? colors.accentPink : colors.mutedForeground} />
                <Text style={[styles.actionCount, { color: liked ? colors.accentPink : colors.mutedForeground }]}>
                  {formatCount(likeCount)}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Text style={[styles.timestamp, { color: "#4a4a6a" }]}>{question.timestamp}</Text>
          </View>
        </View>
      </View>

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
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
  },
  qLabel: {
    flexDirection: "row-reverse",
    alignItems: "center",
    alignSelf: "flex-end",
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
    gap: 4,
  },
  qLabelText: {
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: "600" as const,
    textTransform: "uppercase",
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
  qText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: "right",
  },
  footer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  answerBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 1,
    gap: 6,
  },
  answerBtnText: {
    fontSize: 11,
    fontWeight: "500" as const,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionBtn: {
    flexDirection: "row-reverse",
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
