import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

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
  const [retries, setRetries] = useState(0);

  async function handlePress() {
    if (isTranslated) {
      onTranslated(null);
      setError(false);
      return;
    }
    if (loading) return;
    setLoading(true);
    setError(false);
    try {
      const result = await translateText(text, langCode);
      setRetries(0);
      onTranslated(result);
    } catch {
      setError(true);
      setRetries((r) => r + 1);
    } finally {
      setLoading(false);
    }
  }

  const dir = isRTL ? "row-reverse" : "row";

  let label: string;
  let iconColor: string;
  let icon: "globe" | "alert-circle" | "refresh-cw" = "globe";

  if (loading) {
    label = t("translating");
    iconColor = colors.accentCyan;
  } else if (error) {
    label = retries >= 2 ? t("translateError") : `${t("translateError")} — ${t("translate")}?`;
    iconColor = colors.accentRed;
    icon = "refresh-cw";
  } else if (isTranslated) {
    label = t("showOriginal");
    iconColor = colors.accentCyan;
  } else {
    label = t("translate");
    iconColor = colors.accentCyan;
  }

  return (
    <TouchableOpacity
      style={[styles.btn, { flexDirection: dir }]}
      onPress={handlePress}
      disabled={loading}
      testID="translate-btn"
    >
      {loading ? (
        <ActivityIndicator size={11} color={colors.accentCyan} />
      ) : (
        <Feather name={icon} size={11} color={iconColor} />
      )}
      <Text style={[styles.label, { color: iconColor }]}>{label}</Text>
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
