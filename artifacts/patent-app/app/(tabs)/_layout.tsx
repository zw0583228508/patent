import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { router, Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSettings } from "@/context/SettingsContext";
import { useColors } from "@/hooks/useColors";

function FABSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useSettings();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleA = useRef(new Animated.Value(1)).current;
  const scaleB = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 70,
        friction: 12,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const screenH = Dimensions.get("window").height;
  const sheetH = 260;
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [sheetH, 0],
  });
  const backdropOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  function pressOption(type: "tip" | "question", scaleRef: Animated.Value) {
    Animated.sequence([
      Animated.timing(scaleRef, {
        toValue: 0.95,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.spring(scaleRef, { toValue: 1, useNativeDriver: true }),
    ]).start(() => {
      onClose();
      setTimeout(() => router.push(`/post?type=${type}`), 120);
    });
  }

  const dir = isRTL ? "row-reverse" : "row";

  const OPTIONS = [
    {
      type: "tip" as const,
      icon: "zap",
      label: t("newTip"),
      desc: t("shareKnowledge"),
      color: colors.primary,
      bg: "rgba(240,224,64,0.10)",
      border: "rgba(240,224,64,0.30)",
      scale: scaleA,
    },
    {
      type: "question" as const,
      icon: "help-circle",
      label: t("requestSolution"),
      desc: t("communityHelps"),
      color: colors.accentCyan,
      bg: "rgba(64,224,240,0.10)",
      border: "rgba(64,224,240,0.30)",
      scale: scaleB,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.fabSheet,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom + 16,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

        <Text
          style={[
            styles.sheetTitle,
            { color: colors.foreground, textAlign: isRTL ? "right" : "left" },
          ]}
        >
          {t("post")}
        </Text>

        <View style={[styles.optionsRow, { flexDirection: dir }]}>
          {OPTIONS.map((opt) => (
            <Animated.View
              key={opt.type}
              style={{ flex: 1, transform: [{ scale: opt.scale }] }}
            >
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: opt.bg,
                    borderColor: opt.border,
                  },
                ]}
                onPress={() => pressOption(opt.type, opt.scale)}
                testID={`fab-option-${opt.type}`}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.optionIcon,
                    { backgroundColor: opt.bg, borderColor: opt.border },
                  ]}
                >
                  <Feather name={opt.icon as any} size={26} color={opt.color} />
                </View>
                <Text style={[styles.optionLabel, { color: opt.color }]}>
                  {opt.label}
                </Text>
                <Text
                  style={[
                    styles.optionDesc,
                    { color: colors.mutedForeground, textAlign: "center" },
                  ]}
                >
                  {opt.desc}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </Modal>
  );
}

function FABButton() {
  const colors = useColors();
  const [sheetOpen, setSheetOpen] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  function handlePress() {
    if (Platform.OS !== "web") {
      const Haptics = require("expo-haptics");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.88,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: sheetOpen ? 0 : 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
    setSheetOpen(true);
  }

  function handleClose() {
    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start();
    setSheetOpen(false);
  }

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={handlePress}
          testID="fab-post"
          activeOpacity={0.85}
        >
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Feather name="plus" size={24} color={colors.primaryForeground} />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      <FABSheet visible={sheetOpen} onClose={handleClose} />
    </>
  );
}

function NativeTabLayout() {
  const { t } = useSettings();
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>{t("tabHome")}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="trending">
        <Icon sf={{ default: "chart.line.uptrend.xyaxis", selected: "chart.line.uptrend.xyaxis" }} />
        <Label>{t("tabTrending")}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search">
        <Icon sf={{ default: "magnifyingglass", selected: "magnifyingglass" }} />
        <Label>{t("tabSearch")}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: "person", selected: "person.fill" }} />
        <Label>{t("tabProfile")}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const { t } = useSettings();
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : "#0d0d14",
          borderTopWidth: 1,
          borderTopColor: "#1c1c27",
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "#0d0d14" }]} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabHome"),
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="house" tintColor={color} size={24} />
            ) : (
              <Feather name="home" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: "",
          tabBarLabel: () => null,
          tabBarButton: () => <FABButton />,
        }}
      />
      <Tabs.Screen
        name="trending"
        options={{
          title: t("tabTrending"),
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="chart.line.uptrend.xyaxis" tintColor={color} size={24} />
            ) : (
              <Feather name="trending-up" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t("tabSearch"),
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="magnifyingglass" tintColor={color} size={24} />
            ) : (
              <Feather name="search" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabProfile"),
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="person" tintColor={color} size={24} />
            ) : (
              <Feather name="user" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}

const styles = StyleSheet.create({
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.60)",
  },
  fabSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#7070a0",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  optionsRow: {
    gap: 12,
  },
  optionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "700" as const,
    textAlign: "center",
  },
  optionDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
});
