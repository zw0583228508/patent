import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
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

import { useSettings } from "@/context/SettingsContext";
import { CATEGORIES } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

export default function PostScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useSettings();
  const params = useLocalSearchParams<{ type?: string }>();
  const [postType, setPostType] = useState<"tip" | "question">(
    params.type === "question" ? "question" : "tip"
  );
  const [text, setText] = useState("");
  const [category, setCategory] = useState("home");
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const dir = isRTL ? "row-reverse" : "row";
  const textAlign = isRTL ? "right" : "left";

  const categoryLabels: Record<string, string> = {
    home: t("home"),
    food: t("food"),
    business: t("business"),
    health: t("health"),
    tech: t("tech"),
    nature: t("nature"),
  };

  const POST_TYPES = [
    {
      id: "tip",
      label: t("newTip"),
      icon: "zap",
      desc: t("shareKnowledge"),
      accent: colors.primary,
      bg: "rgba(240,224,64,0.10)",
      border: "rgba(240,224,64,0.35)",
    },
    {
      id: "question",
      label: t("requestSolution"),
      icon: "help-circle",
      desc: t("communityHelps"),
      accent: colors.accentCyan,
      bg: "rgba(64,224,240,0.10)",
      border: "rgba(64,224,240,0.35)",
    },
  ];

  function handleSubmit() {
    if (!text.trim()) return;
    if (Platform.OS !== "web")
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 8,
            borderBottomColor: colors.border,
            flexDirection: dir,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeBtn}
          testID="close-btn"
        >
          <Feather name="x" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {t("post")}
        </Text>
        <TouchableOpacity
          style={[
            styles.submitBtn,
            {
              backgroundColor: text.trim()
                ? colors.primary
                : colors.surface2,
            },
          ]}
          onPress={handleSubmit}
          disabled={!text.trim()}
          testID="submit-post-btn"
        >
          <Text
            style={[
              styles.submitBtnText,
              {
                color: text.trim()
                  ? colors.primaryForeground
                  : colors.mutedForeground,
              },
            ]}
          >
            {t("publish")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={[styles.typeRow, { flexDirection: dir }]}>
          {POST_TYPES.map((pt) => {
            const active = postType === pt.id;
            return (
              <TouchableOpacity
                key={pt.id}
                style={[
                  styles.typeBtn,
                  { flexDirection: dir },
                  {
                    backgroundColor: active ? pt.bg : colors.surface2,
                    borderColor: active ? pt.border : colors.border,
                  },
                ]}
                onPress={() => setPostType(pt.id as "tip" | "question")}
                testID={`type-${pt.id}`}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.typeBtnIcon,
                    {
                      backgroundColor: active ? pt.bg : "transparent",
                      borderColor: active ? pt.border : "transparent",
                    },
                  ]}
                >
                  <Feather
                    name={pt.icon as any}
                    size={20}
                    color={active ? pt.accent : colors.mutedForeground}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.typeLabel,
                      {
                        color: active ? pt.accent : colors.foreground,
                        textAlign,
                      },
                    ]}
                  >
                    {pt.label}
                  </Text>
                  <Text
                    style={[
                      styles.typeDesc,
                      { color: colors.mutedForeground, textAlign },
                    ]}
                  >
                    {pt.desc}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TextInput
          style={[
            styles.textArea,
            {
              backgroundColor: colors.surface2,
              borderColor: colors.border,
              color: colors.foreground,
            },
          ]}
          multiline
          numberOfLines={6}
          placeholder={
            postType === "tip"
              ? t("newTip") + "..."
              : t("requestSolution") + "..."
          }
          placeholderTextColor={colors.mutedForeground}
          value={text}
          onChangeText={setText}
          textAlign={textAlign as any}
          textAlignVertical="top"
          testID="post-text-input"
        />

        <Text
          style={[
            styles.catLabel,
            { color: colors.mutedForeground, textAlign },
          ]}
        >
          {t("category")}
        </Text>
        <View
          style={[
            styles.catGrid,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catChip,
                { flexDirection: dir },
                {
                  backgroundColor:
                    category === cat.id
                      ? "rgba(240,224,64,0.12)"
                      : colors.surface2,
                  borderColor:
                    category === cat.id
                      ? "rgba(240,224,64,0.4)"
                      : colors.border,
                },
              ]}
              onPress={() => setCategory(cat.id)}
              testID={`post-cat-${cat.id}`}
            >
              <Feather
                name={cat.icon as any}
                size={13}
                color={
                  category === cat.id
                    ? colors.primary
                    : colors.mutedForeground
                }
              />
              <Text
                style={[
                  styles.catChipText,
                  {
                    color:
                      category === cat.id
                        ? colors.primary
                        : colors.mutedForeground,
                  },
                ]}
              >
                {categoryLabels[cat.id] ?? cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  closeBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: "700" as const },
  submitBtn: { borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 },
  submitBtnText: { fontSize: 14, fontWeight: "600" as const },
  body: { padding: 16, gap: 16 },
  typeRow: { gap: 10 },
  typeBtn: {
    flex: 1,
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  typeBtnIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  typeLabel: { fontSize: 14, fontWeight: "700" as const, marginBottom: 2 },
  typeDesc: { fontSize: 11, lineHeight: 16 },
  textArea: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    minHeight: 140,
  },
  catLabel: { fontSize: 12, fontWeight: "600" as const },
  catGrid: { flexWrap: "wrap", gap: 8 },
  catChip: {
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
  },
  catChipText: { fontSize: 13, fontWeight: "500" as const },
});
