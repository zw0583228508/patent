import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ToastType, useToast } from "@/context/ToastContext";
import { useColors } from "@/hooks/useColors";

const TYPE_COLORS: Record<ToastType, string> = {
  success: "#40e040",
  error: "#f04040",
  info: "#40e0f0",
};

const TYPE_ICONS: Record<ToastType, string> = {
  success: "check-circle",
  error: "alert-circle",
  info: "info",
};

export default function Toast() {
  const { current, dismiss } = useToast();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const prevId = useRef<string | null>(null);

  useEffect(() => {
    if (current && current.id !== prevId.current) {
      prevId.current = current.id;
      Animated.parallel([
        Animated.spring(opacity, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 0 }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 6 }),
      ]).start();
    } else if (!current) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 12, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [current]);

  if (!current) return null;

  const accent = TYPE_COLORS[current.type];
  const icon = current.icon ?? TYPE_ICONS[current.type];
  const bottomOffset = insets.bottom + (Platform.OS === "web" ? 90 : 80);

  return (
    <Animated.View
      style={[
        styles.container,
        { bottom: bottomOffset, opacity, transform: [{ translateY }] },
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        style={[styles.pill, { backgroundColor: colors.surface, borderColor: accent }]}
        onPress={dismiss}
        activeOpacity={0.9}
      >
        <View style={[styles.iconWrap, { backgroundColor: accent + "22" }]}>
          <Feather name={icon as any} size={14} color={accent} />
        </View>
        <Text style={[styles.message, { color: colors.foreground }]}>{current.message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
    pointerEvents: "box-none" as any,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 100,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    maxWidth: 320,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
});
