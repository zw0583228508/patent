import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSettings } from "@/context/SettingsContext";
import { CATEGORIES } from "@/data/mockData";
import { LANGUAGES } from "@/i18n/translations";
import { useColors } from "@/hooks/useColors";

const TOPIC_ICONS: Record<string, string> = {
  home: "home", food: "coffee", business: "briefcase",
  health: "heart", tech: "cpu", nature: "sun",
};

const TOPIC_COLORS: Record<string, string> = {
  home: "#f0e040", food: "#f040a0", business: "#40e0f0",
  health: "#40e040", tech: "#a040f0", nature: "#f0a040",
};

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, isRTL, langCode, setLangCode, followedTopics, toggleTopic } = useSettings();
  const [step, setStep] = useState<"lang" | "topics">("lang");
  const dir = isRTL ? "row-reverse" : "row";
  const textAlign = isRTL ? "right" : "left";

  const topicCategories = CATEGORIES.filter((c) => c.id !== "all");

  const TOP_LANGS = ["he", "en", "ar", "ru", "fr", "es", "de", "zh", "pt"];
  const featuredLangs = LANGUAGES.filter((l) => TOP_LANGS.includes(l.code));

  async function finish() {
    await AsyncStorage.setItem("@patent:onboarded", "1");
    router.replace("/(tabs)");
  }

  if (step === "lang") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.inner, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
          <Text style={[styles.logo, { color: colors.primary }]}>Patent</Text>
          <Text style={[styles.title, { color: colors.foreground, textAlign: "center" }]}>
            {t("welcomeTitle")}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground, textAlign: "center" }]}>
            באיזו שפה נדבר?
          </Text>

          <ScrollView style={styles.langList} showsVerticalScrollIndicator={false}>
            {featuredLangs.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langRow,
                  { flexDirection: dir, borderColor: langCode === lang.code ? colors.primary : colors.border,
                    backgroundColor: langCode === lang.code ? "rgba(240,224,64,0.10)" : colors.surface2 },
                ]}
                onPress={() => setLangCode(lang.code)}
                testID={`lang-${lang.code}`}
              >
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <Text style={[styles.langName, { color: langCode === lang.code ? colors.primary : colors.foreground, textAlign }]}>
                  {lang.nativeName}
                </Text>
                {langCode === lang.code && (
                  <Feather name="check" size={16} color={colors.primary} style={{ marginStart: "auto" }} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={() => setStep("topics")}
            testID="next-step-btn"
          >
            <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>
              {t("letsGo")} →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.inner, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 }]}>
        <Text style={[styles.logo, { color: colors.primary }]}>Patent</Text>
        <Text style={[styles.title, { color: colors.foreground, textAlign: "center" }]}>
          {t("welcomeSubtitle")}
        </Text>

        <View style={styles.topicsGrid}>
          {topicCategories.map((cat) => {
            const selected = followedTopics.includes(cat.id);
            const accentColor = TOPIC_COLORS[cat.id] ?? colors.primary;
            const labelMap: Record<string, string> = {
              home: t("home"), food: t("food"), business: t("business"),
              health: t("health"), tech: t("tech"), nature: t("nature"),
            };
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.topicCard,
                  {
                    backgroundColor: selected ? `${accentColor}18` : colors.surface2,
                    borderColor: selected ? accentColor : colors.border,
                  },
                ]}
                onPress={() => toggleTopic(cat.id)}
                testID={`topic-${cat.id}`}
              >
                <View style={[styles.topicIcon, { backgroundColor: `${accentColor}20` }]}>
                  <Feather name={TOPIC_ICONS[cat.id] as any} size={22} color={accentColor} />
                </View>
                <Text style={[styles.topicLabel, { color: selected ? accentColor : colors.foreground }]}>
                  {labelMap[cat.id] ?? cat.label}
                </Text>
                {selected && (
                  <View style={[styles.topicCheck, { backgroundColor: accentColor }]}>
                    <Feather name="check" size={10} color="#0a0a0f" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.hint, { color: colors.mutedForeground, textAlign: "center" }]}>
          {followedTopics.length === 0 ? "בחר לפחות נושא אחד, או דלג לראות הכל" : `${followedTopics.length} נושאים נבחרו`}
        </Text>

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={finish}
          testID="finish-onboarding-btn"
        >
          <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>
            {t("letsGo")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={finish} testID="skip-btn">
          <Text style={[styles.skipText, { color: colors.mutedForeground }]}>{t("skipForNow")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { alignItems: "center", paddingHorizontal: 24, gap: 20 },
  logo: { fontSize: 32, fontWeight: "800" as const, letterSpacing: -1 },
  title: { fontSize: 22, fontWeight: "700" as const, lineHeight: 30 },
  subtitle: { fontSize: 15, lineHeight: 22 },
  langList: { width: "100%", maxHeight: 320 },
  langRow: {
    alignItems: "center", gap: 12, borderRadius: 14, borderWidth: 1,
    paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8,
  },
  langFlag: { fontSize: 22 },
  langName: { fontSize: 16, fontWeight: "500" as const, flex: 1 },
  topicsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, width: "100%", justifyContent: "center" },
  topicCard: {
    width: "44%", alignItems: "center", borderRadius: 18, borderWidth: 1,
    paddingVertical: 20, paddingHorizontal: 12, gap: 10, position: "relative",
  },
  topicIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  topicLabel: { fontSize: 14, fontWeight: "600" as const },
  topicCheck: {
    position: "absolute", top: 8, right: 8, width: 20, height: 20,
    borderRadius: 10, alignItems: "center", justifyContent: "center",
  },
  hint: { fontSize: 13 },
  primaryBtn: {
    width: "100%", borderRadius: 16, paddingVertical: 16,
    alignItems: "center", marginTop: 4,
  },
  primaryBtnText: { fontSize: 16, fontWeight: "700" as const },
  skipText: { fontSize: 14, paddingVertical: 8 },
});
