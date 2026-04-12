import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { ContentFilter, NotifFilters, useSettings } from "@/context/SettingsContext";
import { CATEGORIES } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";
import { LANGUAGES } from "@/i18n/translations";
import { api } from "@/utils/api";

type Section = "main" | "language";

const CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  he: { home: "בית", food: "אוכל", business: "עסקים", health: "בריאות", tech: "טכנולוגיה", nature: "טבע" },
  en: { home: "Home", food: "Food", business: "Business", health: "Health", tech: "Technology", nature: "Nature" },
  ar: { home: "المنزل", food: "طعام", business: "أعمال", health: "صحة", tech: "تكنولوجيا", nature: "طبيعة" },
  es: { home: "Hogar", food: "Comida", business: "Negocios", health: "Salud", tech: "Tecnología", nature: "Naturaleza" },
  fr: { home: "Maison", food: "Nourriture", business: "Affaires", health: "Santé", tech: "Technologie", nature: "Nature" },
  de: { home: "Zuhause", food: "Essen", business: "Business", health: "Gesundheit", tech: "Technologie", nature: "Natur" },
  ru: { home: "Дом", food: "Еда", business: "Бизнес", health: "Здоровье", tech: "Технологии", nature: "Природа" },
  zh: { home: "家庭", food: "美食", business: "商务", health: "健康", tech: "科技", nature: "自然" },
  pt: { home: "Casa", food: "Comida", business: "Negócios", health: "Saúde", tech: "Tecnologia", nature: "Natureza" },
};

function getCatLabel(catId: string, langCode: string): string {
  return CATEGORY_TRANSLATIONS[langCode]?.[catId] ?? CATEGORY_TRANSLATIONS["en"]?.[catId] ?? catId;
}

type FilterOption = { value: ContentFilter; labelKey: "notifFilterAll" | "notifFilterTips" | "notifFilterQuestions" | "notifFilterComments" };

const FILTER_OPTIONS_BASE: FilterOption[] = [
  { value: "all", labelKey: "notifFilterAll" },
  { value: "tips", labelKey: "notifFilterTips" },
  { value: "questions", labelKey: "notifFilterQuestions" },
];

const FILTER_OPTIONS_WITH_COMMENTS: FilterOption[] = [
  ...FILTER_OPTIONS_BASE,
  { value: "comments", labelKey: "notifFilterComments" },
];

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, langCode, setLangCode, isRTL, notifs, setNotif, notifFilters, setNotifFilter, followedTopics, toggleTopic } = useSettings();
  const { user } = useAuth();
  const [section, setSection] = useState<Section>("main");

  function handleNotifToggle(key: "answers" | "comments" | "topics", val: boolean) {
    setNotif(key, val);
    if (!user?.id) return;
    const filter = notifFilters[key];
    if (key === "answers") api.users.saveNotifPrefs(user.id, { notifVotes: val, notifVotesFilter: filter }).catch(() => {});
    if (key === "comments") api.users.saveNotifPrefs(user.id, { notifComments: val, notifCommentsFilter: filter }).catch(() => {});
  }

  function handleFilterChange(key: keyof NotifFilters, val: ContentFilter) {
    setNotifFilter(key, val);
    if (!user?.id) return;
    if (key === "answers") api.users.saveNotifPrefs(user.id, { notifVotes: notifs.answers, notifVotesFilter: val }).catch(() => {});
    if (key === "comments") api.users.saveNotifPrefs(user.id, { notifComments: notifs.comments, notifCommentsFilter: val }).catch(() => {});
    if (key === "topics") api.users.saveNotifPrefs(user.id, { notifTopicsFilter: val }).catch(() => {});
  }

  const [langSearch, setLangSearch] = useState("");
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const dir = isRTL ? "row-reverse" : "row";
  const textAlign = isRTL ? "right" : "left";

  const filteredLangs = LANGUAGES.filter((l) =>
    l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  const currentLang = LANGUAGES.find((l) => l.code === langCode);

  if (section === "language") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => setSection("main")} style={styles.backBtn} testID="back-btn">
            <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground, textAlign }]}>{t("languageTitle")}</Text>
        </View>

        <View style={[styles.searchBar, { backgroundColor: colors.surface2, borderColor: colors.border, margin: 16 }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder={t("searchLanguage")}
            placeholderTextColor={colors.mutedForeground}
            value={langSearch}
            onChangeText={setLangSearch}
            textAlign={isRTL ? "right" : "left"}
          />
        </View>

        <FlatList
          data={filteredLangs}
          keyExtractor={(l) => l.code}
          renderItem={({ item: lang }) => {
            const selected = lang.code === langCode;
            return (
              <TouchableOpacity
                style={[
                  styles.langRow,
                  {
                    flexDirection: dir,
                    borderBottomColor: colors.border,
                    backgroundColor: selected ? "rgba(240,224,64,0.07)" : "transparent",
                  },
                ]}
                onPress={() => { setLangCode(lang.code); setSection("main"); }}
                testID={`lang-${lang.code}`}
              >
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <Text style={[styles.langName, { color: selected ? colors.primary : colors.foreground }]}>
                  {lang.nativeName}
                </Text>
                {selected && (
                  <Feather name="check" size={18} color={colors.primary} style={{ marginLeft: isRTL ? 0 : "auto", marginRight: isRTL ? "auto" : 0 }} />
                )}
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="close-settings-btn">
          <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground, textAlign }]}>{t("settingsTitle")}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, textAlign }]}>{t("language")}</Text>
        <TouchableOpacity
          style={[styles.row, { flexDirection: dir, backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setSection("language")}
          testID="language-picker"
        >
          <Text style={styles.langFlagInline}>{currentLang?.flag ?? "🌐"}</Text>
          <Text style={[styles.rowLabel, { color: colors.foreground }]}>{currentLang?.nativeName ?? langCode}</Text>
          <Feather
            name={isRTL ? "chevron-left" : "chevron-right"}
            size={18}
            color={colors.mutedForeground}
            style={{ marginLeft: isRTL ? 0 : "auto", marginRight: isRTL ? "auto" : 0 }}
          />
        </TouchableOpacity>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, textAlign, marginTop: 24 }]}>{t("notificationsTitle")}</Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <NotifRow
            label={t("notifyAnswers")}
            desc={t("notifyAnswersDesc")}
            value={notifs.answers}
            onToggle={(v) => handleNotifToggle("answers", v)}
            filterValue={notifFilters.answers}
            onFilterChange={(v) => handleFilterChange("answers", v)}
            filterOptions={FILTER_OPTIONS_BASE}
            isRTL={isRTL}
            colors={colors}
            t={t}
            testID="notif-answers"
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <NotifRow
            label={t("notifyComments")}
            desc={t("notifyCommentsDesc")}
            value={notifs.comments}
            onToggle={(v) => handleNotifToggle("comments", v)}
            filterValue={notifFilters.comments}
            onFilterChange={(v) => handleFilterChange("comments", v)}
            filterOptions={FILTER_OPTIONS_WITH_COMMENTS}
            isRTL={isRTL}
            colors={colors}
            t={t}
            testID="notif-comments"
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <NotifRow
            label={t("notifyTopics")}
            desc={t("notifyTopicsDesc")}
            value={notifs.topics}
            onToggle={(v) => handleNotifToggle("topics", v)}
            filterValue={notifFilters.topics}
            onFilterChange={(v) => handleFilterChange("topics", v)}
            filterOptions={FILTER_OPTIONS_BASE}
            isRTL={isRTL}
            colors={colors}
            t={t}
            testID="notif-topics"
          />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, textAlign, marginTop: 24 }]}>{t("topicsTitle")}</Text>
        <Text style={[styles.sectionSub, { color: colors.mutedForeground, textAlign }]}>{t("topicsSubtitle")}</Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {CATEGORIES.filter((c) => c.id !== "all").map((cat, idx, arr) => {
            const followed = followedTopics.includes(cat.id);
            return (
              <React.Fragment key={cat.id}>
                <TouchableOpacity
                  style={[styles.topicRow, { flexDirection: dir }]}
                  onPress={() => toggleTopic(cat.id)}
                  testID={`topic-${cat.id}`}
                >
                  <View style={[styles.topicIconWrap, { backgroundColor: followed ? "rgba(240,224,64,0.12)" : colors.surface2 }]}>
                    <Feather name={cat.icon as any} size={16} color={followed ? colors.primary : colors.mutedForeground} />
                  </View>
                  <Text style={[styles.topicLabel, { color: colors.foreground, textAlign }]}>
                    {getCatLabel(cat.id, langCode)}
                  </Text>
                  <View style={[
                    styles.checkbox,
                    {
                      borderColor: followed ? colors.primary : colors.border,
                      backgroundColor: followed ? colors.primary : "transparent",
                      marginLeft: isRTL ? 0 : "auto",
                      marginRight: isRTL ? "auto" : 0,
                    },
                  ]}>
                    {followed && <Feather name="check" size={12} color={colors.primaryForeground} />}
                  </View>
                </TouchableOpacity>
                {idx < arr.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              </React.Fragment>
            );
          })}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, textAlign, marginTop: 24 }]}>{t("legalSection")}</Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.row, { flexDirection: dir, borderWidth: 0, borderRadius: 0 }]}
            onPress={() => router.push("/privacy?section=privacy" as any)}
            testID="privacy-policy-btn"
          >
            <View style={[styles.topicIconWrap, { backgroundColor: colors.surface2 }]}>
              <Feather name="shield" size={16} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.foreground }]}>{t("privacyPolicy")}</Text>
            <Feather
              name={isRTL ? "chevron-left" : "chevron-right"}
              size={18}
              color={colors.mutedForeground}
              style={{ marginLeft: isRTL ? 0 : "auto", marginRight: isRTL ? "auto" : 0 }}
            />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <TouchableOpacity
            style={[styles.row, { flexDirection: dir, borderWidth: 0, borderRadius: 0 }]}
            onPress={() => router.push("/privacy?section=terms" as any)}
            testID="terms-btn"
          >
            <View style={[styles.topicIconWrap, { backgroundColor: colors.surface2 }]}>
              <Feather name="file-text" size={16} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.foreground }]}>{t("termsOfService")}</Text>
            <Feather
              name={isRTL ? "chevron-left" : "chevron-right"}
              size={18}
              color={colors.mutedForeground}
              style={{ marginLeft: isRTL ? 0 : "auto", marginRight: isRTL ? "auto" : 0 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.versionRow}>
          <Text style={[styles.versionText, { color: colors.mutedForeground }]}>
            {t("aboutApp")} · {t("appVersion")} 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function NotifRow({ label, desc, value, onToggle, filterValue, onFilterChange, filterOptions, isRTL, colors, t, testID }: {
  label: string;
  desc: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  filterValue: ContentFilter;
  onFilterChange: (v: ContentFilter) => void;
  filterOptions: { value: ContentFilter; labelKey: "notifFilterAll" | "notifFilterTips" | "notifFilterQuestions" | "notifFilterComments" }[];
  isRTL: boolean;
  colors: any;
  t: (key: any) => string;
  testID: string;
}) {
  const dir = isRTL ? "row-reverse" : "row";
  return (
    <View>
      <View style={[styles.notifRow, { flexDirection: dir }]}>
        <View style={styles.notifText}>
          <Text style={[styles.notifLabel, { color: colors.foreground, textAlign: isRTL ? "right" : "left" }]}>{label}</Text>
          <Text style={[styles.notifDesc, { color: colors.mutedForeground, textAlign: isRTL ? "right" : "left" }]}>{desc}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: "rgba(240,224,64,0.4)" }}
          thumbColor={value ? colors.primary : colors.mutedForeground}
          testID={testID}
          style={{ marginLeft: isRTL ? 0 : "auto", marginRight: isRTL ? "auto" : 0 }}
        />
      </View>

      {value && (
        <View style={[styles.filterSection, { borderTopColor: colors.border }]}>
          <Text style={[styles.filterLabel, { color: colors.mutedForeground, textAlign: isRTL ? "right" : "left" }]}>
            {t("notifFilterLabel")}
          </Text>
          <View style={[styles.filterChips, { flexDirection: dir, flexWrap: "wrap" }]}>
            {filterOptions.map((opt) => {
              const active = filterValue === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active ? "rgba(240,224,64,0.15)" : colors.surface2,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => onFilterChange(opt.value)}
                  testID={`${testID}-filter-${opt.value}`}
                >
                  {active && (
                    <Feather name="check" size={11} color={colors.primary} />
                  )}
                  <Text style={[styles.chipText, { color: active ? colors.primary : colors.mutedForeground }]}>
                    {t(opt.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: "700" as const, flex: 1 },
  content: { padding: 16 },
  sectionLabel: { fontSize: 11, fontWeight: "600" as const, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 },
  sectionSub: { fontSize: 13, marginBottom: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  langFlagInline: { fontSize: 22 },
  rowLabel: { fontSize: 16, fontWeight: "500" as const },
  card: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  divider: { height: StyleSheet.hairlineWidth },
  notifRow: { alignItems: "center", padding: 16, gap: 12 },
  notifText: { flex: 1 },
  notifLabel: { fontSize: 15, fontWeight: "500" as const, marginBottom: 3 },
  notifDesc: { fontSize: 12, lineHeight: 16 },
  filterSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 10,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  filterChips: { gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontWeight: "500" as const },
  topicRow: { alignItems: "center", padding: 16, gap: 12 },
  topicIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  topicLabel: { fontSize: 15, flex: 1 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  searchBar: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, height: 44, gap: 8 },
  searchInput: { flex: 1, fontSize: 15 },
  langRow: { alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, gap: 14 },
  langFlag: { fontSize: 24 },
  langName: { fontSize: 16 },
  versionRow: { alignItems: "center", paddingVertical: 24 },
  versionText: { fontSize: 12 },
});
