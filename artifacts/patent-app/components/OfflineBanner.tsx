import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useColors } from "@/hooks/useColors";

export default function OfflineBanner() {
  const isOnline = useNetworkStatus();
  const colors = useColors();
  const slideAnim = useRef(new Animated.Value(-60)).current;
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOfflineRef.current = true;
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 200 }).start();
    } else if (wasOfflineRef.current) {
      Animated.timing(slideAnim, { toValue: -60, duration: 400, useNativeDriver: true }).start();
    }
  }, [isOnline]);

  if (isOnline && !wasOfflineRef.current) return null;

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          backgroundColor: isOnline ? "rgba(64,224,64,0.95)" : "rgba(240,64,64,0.95)",
          transform: [{ translateY: slideAnim }],
        },
      ]}
      pointerEvents="none"
    >
      <Feather name={isOnline ? "wifi" : "wifi-off"} size={14} color="#fff" />
      <Text style={styles.text}>
        {isOnline ? "חיבור חזר" : "אין חיבור לאינטרנט"}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  text: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
