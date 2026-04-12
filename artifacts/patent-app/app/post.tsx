import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CATEGORIES } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const POST_TYPES = [
  { id: "tip", label: "טיפ חדש", icon: "zap", desc: "שתף ידע שגילית" },
  { id: "question", label: "בקש פתרון", icon: "help-circle", desc: "הקהילה תעזור" },
];

export default function PostScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [postType, setPostType] = useState<"tip" | "question">("tip");
  const [text, setText] = useState("");
  const [category, setCategory] = useState("home");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  function handleSubmit() {
    if (!text.trim()) return;
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} testID="close-btn">
          <Feather name="x" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>פרסם</Text>
        <TouchableOpacity
          style={[
            styles.submitBtn,
            {
              backgroundColor: text.trim() ? colors.primary : colors.surface2,
            },
          ]}
          onPress={handleSubmit}
          disabled={!text.trim()}
          testID="submit-post-btn"
        >
          <Text style={[styles.submitBtnText, { color: text.trim() ? colors.primaryForeground : colors.mutedForeground }]}>
            פרסם
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.typeRow}>
          {POST_TYPES.map((pt) => (
            <TouchableOpacity
              key={pt.id}
              style={[
                styles.typeBtn,
                {
                  backgroundColor: postType === pt.id ? "rgba(240,224,64,0.12)" : colors.surface2,
                  borderColor: postType === pt.id ? "rgba(240,224,64,0.4)" : colors.border,
                },
              ]}
              onPress={() => setPostType(pt.id as "tip" | "question")}
              testID={`type-${pt.id}`}
            >
              <Feather name={pt.icon as any} size={16} color={postType === pt.id ? colors.primary : colors.mutedForeground} />
              <View>
                <Text style={[styles.typeLabel, { color: postType === pt.id ? colors.primary : colors.foreground }]}>
                  {pt.label}
                </Text>
                <Text style={[styles.typeDesc, { color: colors.mutedForeground }]}>{pt.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={[styles.textArea, { backgroundColor: colors.surface2, borderColor: colors.border, color: colors.foreground }]}
          multiline
          numberOfLines={6}
          placeholder={postType === "tip" ? "מה הטיפ שגילית?" : "מה הבעיה שאתה מחפש פתרון לה?"}
          placeholderTextColor={colors.mutedForeground}
          value={text}
          onChangeText={setText}
          textAlign="right"
          textAlignVertical="top"
          testID="post-text-input"
        />

        <Text style={[styles.catLabel, { color: colors.mutedForeground }]}>קטגוריה</Text>
        <View style={styles.catGrid}>
          {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catChip,
                {
                  backgroundColor: category === cat.id ? "rgba(240,224,64,0.12)" : colors.surface2,
                  borderColor: category === cat.id ? "rgba(240,224,64,0.4)" : colors.border,
                },
              ]}
              onPress={() => setCategory(cat.id)}
              testID={`post-cat-${cat.id}`}
            >
              <Feather name={cat.icon as any} size={13} color={category === cat.id ? colors.primary : colors.mutedForeground} />
              <Text style={[styles.catChipText, { color: category === cat.id ? colors.primary : colors.mutedForeground }]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  submitBtn: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  body: {
    padding: 16,
    gap: 16,
  },
  typeRow: {
    flexDirection: "row-reverse",
    gap: 10,
  },
  typeBtn: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    textAlign: "right",
  },
  typeDesc: {
    fontSize: 11,
    textAlign: "right",
    marginTop: 2,
  },
  textArea: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    minHeight: 140,
  },
  catLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    textAlign: "right",
  },
  catGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },
  catChip: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
  },
  catChipText: {
    fontSize: 13,
    fontWeight: "500" as const,
  },
});
