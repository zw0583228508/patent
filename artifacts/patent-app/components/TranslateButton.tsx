import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useSettings } from "@/context/SettingsContext";
import { useColors } from "@/hooks/useColors";
import { translateText } from "@/utils/translate";

type Props = {
  text: string;
  onTranslated: (translated: string | null) => void;
  isTranslated: boolean;
};

export default function TranslateButton({ text, onTranslated, isTranslated }: Props) {
  const colors = useColors();
  const { t, langCode, isRTL } = useSettings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  if (langCode === "he") return null;

  async function handlePress() {
    if (isTranslated) {
      onTranslated(null);
      setError(false);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const result = await translateText(text, langCode);
      onTranslated(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableOpacity
      style={[styles.btn, { flexDirection: isRTL ? "row-reverse" : "row" }]}
      onPress={handlePress}
      disabled={loading}
      testID="translate-btn"
    >
      {loading ? (
        <ActivityIndicator size={11} color={colors.accentCyan} />
      ) : (
        <Feather name="globe" size={11} color={error ? colors.accentRed : colors.accentCyan} />
      )}
      <Text style={[styles.label, { color: error ? colors.accentRed : colors.accentCyan }]}>
        {loading ? t("translating") : error ? t("translateError") : isTranslated ? t("showOriginal") : t("translate")}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: "500" as const,
  },
});
