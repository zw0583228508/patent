import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { getTranslations, isRTLLang, TKeys, Translations } from "@/i18n/translations";

type NotifSettings = {
  answers: boolean;
  comments: boolean;
  topics: boolean;
};

type SettingsContextType = {
  langCode: string;
  setLangCode: (code: string) => void;
  isRTL: boolean;
  t: (key: TKeys) => string;
  notifs: NotifSettings;
  setNotif: (key: keyof NotifSettings, val: boolean) => void;
  followedTopics: string[];
  toggleTopic: (topicId: string) => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

const DEFAULT_NOTIFS: NotifSettings = { answers: true, comments: true, topics: false };
const DEFAULT_TOPICS: string[] = [];

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [langCode, setLangCodeState] = useState("he");
  const [notifs, setNotifs] = useState<NotifSettings>(DEFAULT_NOTIFS);
  const [followedTopics, setFollowedTopics] = useState<string[]>(DEFAULT_TOPICS);
  const [translations, setTranslations] = useState<Translations>(getTranslations("he"));

  useEffect(() => {
    AsyncStorage.multiGet(["patent_lang", "patent_notifs", "patent_topics"]).then((results) => {
      const lang = results[0][1];
      const notifsRaw = results[1][1];
      const topicsRaw = results[2][1];
      if (lang) {
        setLangCodeState(lang);
        setTranslations(getTranslations(lang));
      }
      if (notifsRaw) setNotifs(JSON.parse(notifsRaw));
      if (topicsRaw) setFollowedTopics(JSON.parse(topicsRaw));
    });
  }, []);

  function setLangCode(code: string) {
    setLangCodeState(code);
    setTranslations(getTranslations(code));
    AsyncStorage.setItem("patent_lang", code);
  }

  function setNotif(key: keyof NotifSettings, val: boolean) {
    setNotifs((prev) => {
      const next = { ...prev, [key]: val };
      AsyncStorage.setItem("patent_notifs", JSON.stringify(next));
      return next;
    });
  }

  function toggleTopic(topicId: string) {
    setFollowedTopics((prev) => {
      const next = prev.includes(topicId) ? prev.filter((t) => t !== topicId) : [...prev, topicId];
      AsyncStorage.setItem("patent_topics", JSON.stringify(next));
      return next;
    });
  }

  const t = useCallback((key: TKeys): string => translations[key] ?? key, [translations]);

  const isRTL = isRTLLang(langCode);

  return (
    <SettingsContext.Provider value={{ langCode, setLangCode, isRTL, t, notifs, setNotif, followedTopics, toggleTopic }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be inside SettingsProvider");
  return ctx;
}
