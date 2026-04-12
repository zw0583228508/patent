import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import MediaPicker, { MediaAsset } from "@/components/MediaPicker";
import TranslateButton from "@/components/TranslateButton";
import { useAuth } from "@/context/AuthContext";
import { useFeed } from "@/context/FeedContext";
import { useSettings } from "@/context/SettingsContext";
import { useToast } from "@/context/ToastContext";
import { Comment } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";
import { api } from "@/utils/api";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

type Props = {
  visible: boolean;
  itemId: string;
  itemText: string;
  isQuestion?: boolean;
  onClose: () => void;
};

export default function CommentsSheet({ visible, itemId, itemText, isQuestion, onClose }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { comments, addComment } = useFeed();
  const { t, isRTL } = useSettings();
  const { isLoggedIn, setShowLoginModal, user } = useAuth();
  const { showToast } = useToast();
  const [text, setText] = useState("");
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [commentLikes, setCommentLikes] = useState<Set<string>>(new Set());
  const [translatedComments, setTranslatedComments] = useState<Record<string, string | null>>({});
  const inputRef = useRef<TextInput>(null);

  const itemComments: Comment[] = comments[itemId] ?? [];

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 1, tension: 65, friction: 11, useNativeDriver: true }).start(() => {
        if (isQuestion) {
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      });
    } else {
      Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    }
  }, [visible]);

  const screenHeight = Dimensions.get("window").height;
  const sheetHeight = Math.min(screenHeight * 0.75, 600);
  const translateY = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [sheetHeight, 0] });
  const dir = isRTL ? "row-reverse" : "row";
  const textAlign = isRTL ? "right" : "left";

  function handleSubmit() {
    if (!text.trim() && media.length === 0) return;
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addComment(itemId, text.trim());
    const commentText = text.trim();
    setText("");
    setMedia([]);
    showToast(t("toastCommentAdded"), "success", "message-circle");
    if (user && commentText) {
      api.comments.create({
        id: "cmt_" + Date.now() + Math.random().toString(36).slice(2, 7),
        postId: itemId,
        content: commentText,
      }).catch(() => {});
    }
  }

  function toggleCommentLike(commentId: string) {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCommentLikes((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  }

  const renderComment = ({ item }: { item: Comment }) => {
    const liked = commentLikes.has(item.id);
    const count = item.likeCount + (liked ? 1 : 0);
    const translated = translatedComments[item.id] ?? null;

    function setTranslated(val: string | null) {
      setTranslatedComments((prev) => ({ ...prev, [item.id]: val }));
    }

    return (
      <View style={[styles.comment, { borderBottomColor: colors.border, flexDirection: dir }]}>
        <View style={[styles.commentAvatar, { backgroundColor: item.avatarColor }]}>
          <Text style={styles.commentAvatarText}>{item.initials}</Text>
        </View>
        <View style={[styles.commentBody, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
          <View style={[styles.commentHeader, { flexDirection: dir }]}>
            <Text style={[styles.commentAuthor, { color: colors.foreground }]}>{item.author}</Text>
            <Text style={[styles.commentTime, { color: "#4a4a6a" }]}>{item.timestamp}</Text>
          </View>
          <Text style={[styles.commentText, { color: "#c0c0d8", textAlign }]}>
            {translated ?? item.text}
          </Text>
          <View style={[styles.commentActions, { flexDirection: dir }]}>
            <TranslateButton
              text={item.text}
              isTranslated={translated !== null}
              onTranslated={setTranslated}
            />
            <TouchableOpacity style={[styles.commentLikeRow, { flexDirection: dir }]} onPress={() => toggleCommentLike(item.id)}>
              <Feather name="heart" size={12} color={liked ? colors.accentPink : colors.mutedForeground} />
              <Text style={[styles.commentLikeCount, { color: liked ? colors.accentPink : colors.mutedForeground }]}>
                {count > 0 ? count : ""}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {/* Visual backdrop — no pointer events, purely decorative */}
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.65)" }]} pointerEvents="none" />

      {/* Flex container: dismiss area fills ABOVE the sheet, zero overlap */}
      <View style={styles.modalContainer}>
        <Pressable style={styles.dismissArea} onPress={onClose} />

        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: colors.surface, borderTopColor: colors.border, height: sheetHeight, transform: [{ translateY }] },
          ]}
        >
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        <View style={[styles.sheetHeader, { borderBottomColor: colors.border, flexDirection: dir }]}>
          <Text style={[styles.sheetTitle, { color: colors.foreground }]}>
            {isQuestion ? t("answers") : t("comments")} ({itemComments.length})
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} testID="close-sheet">
            <Feather name="x" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        <View style={[styles.originalPost, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
          <Text style={[styles.originalPostText, { color: colors.mutedForeground, textAlign }]} numberOfLines={2}>
            {itemText}
          </Text>
        </View>

        <FlatList
          data={itemComments}
          keyExtractor={(c) => c.id}
          renderItem={renderComment}
          contentContainerStyle={styles.commentList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyComments}>
              <Feather name="message-circle" size={28} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground, textAlign: "center" }]}>
                {isQuestion ? t("noAnswers") : t("noComments")}
              </Text>
            </View>
          }
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <View style={[styles.inputArea, { borderTopColor: colors.border, paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 8) }]}>
            <MediaPicker media={media} onChange={setMedia} compact />
            <View style={[styles.inputRow, { flexDirection: dir }]}>
              <View style={[styles.myAvatar, { backgroundColor: "#f0e040" }]}>
                <Text style={styles.myAvatarText}>יכ</Text>
              </View>
              <TextInput
                ref={inputRef}
                style={[styles.input, { backgroundColor: colors.surface2, borderColor: colors.border, color: colors.foreground }]}
                placeholder={isQuestion ? t("writeAnswer") : t("addComment")}
                placeholderTextColor={colors.mutedForeground}
                value={text}
                onChangeText={setText}
                textAlign={textAlign as any}
                multiline
                blurOnSubmit={false}
                onSubmitEditing={handleSubmit}
                testID="comment-input"
              />
              <TouchableOpacity
                style={[styles.sendBtn, { backgroundColor: (text.trim() || media.length > 0) ? colors.primary : colors.surface2 }]}
                onPress={handleSubmit}
                disabled={!text.trim() && media.length === 0}
                testID="send-comment-btn"
              >
                <Feather name="send" size={16} color={(text.trim() || media.length > 0) ? colors.primaryForeground : colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "flex-end" },
  dismissArea: { flex: 1 },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1 },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: "center", marginTop: 10, marginBottom: 4 },
  sheetHeader: { alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  sheetTitle: { fontSize: 16, fontWeight: "700" as const },
  closeBtn: { padding: 4 },
  originalPost: { marginHorizontal: 16, marginVertical: 10, borderRadius: 10, borderWidth: 1, padding: 10 },
  originalPostText: { fontSize: 12, lineHeight: 18 },
  commentList: { paddingHorizontal: 16, paddingBottom: 8 },
  comment: { gap: 10, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  commentAvatar: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  commentAvatarText: { fontSize: 10, fontWeight: "700" as const, color: "#0a0a0f" },
  commentBody: { flex: 1, gap: 4 },
  commentHeader: { alignItems: "center", gap: 8, marginBottom: 2 },
  commentAuthor: { fontSize: 12, fontWeight: "600" as const },
  commentTime: { fontSize: 10 },
  commentText: { fontSize: 13, lineHeight: 19 },
  commentActions: { alignItems: "center", gap: 12, marginTop: 2 },
  commentLikeRow: { alignItems: "center", gap: 4 },
  commentLikeCount: { fontSize: 11 },
  emptyComments: { alignItems: "center", paddingVertical: 40, gap: 12 },
  emptyText: { fontSize: 14 },
  inputArea: { paddingHorizontal: 12, paddingTop: 10, borderTopWidth: 1, gap: 8 },
  inputRow: { alignItems: "flex-end", gap: 8 },
  myAvatar: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  myAvatarText: { fontSize: 10, fontWeight: "700" as const, color: "#0a0a0f" },
  input: { flex: 1, borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8, fontSize: 14, maxHeight: 80 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", flexShrink: 0 },
});
