import { Feather } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { AuthUser, useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useColors } from "@/hooks/useColors";

WebBrowser.maybeCompleteAuthSession();

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type LoadingProvider = "google" | "facebook" | null;

export default function LoginModal() {
  const colors = useColors();
  const { t, isRTL } = useSettings();
  const { showLoginModal, setShowLoginModal, login } = useAuth();
  const [loading, setLoading] = useState<LoadingProvider>(null);
  const textAlign = isRTL ? "right" : "left";

  async function handleGoogle() {
    setLoading("google");
    await new Promise((r) => setTimeout(r, 900));
    const mockUser: AuthUser = {
      id: "google_" + Date.now(),
      name: "משתמש Google",
      email: "user@gmail.com",
      initials: "גג",
      avatarColor: "#4285F4",
      provider: "google",
    };
    login(mockUser);
    setLoading(null);
  }

  async function handleFacebook() {
    setLoading("facebook");
    await new Promise((r) => setTimeout(r, 900));
    const mockUser: AuthUser = {
      id: "fb_" + Date.now(),
      name: "משתמש Facebook",
      email: "user@facebook.com",
      initials: "פב",
      avatarColor: "#1877F2",
      provider: "facebook",
    };
    login(mockUser);
    setLoading(null);
  }

  return (
    <Modal
      visible={showLoginModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowLoginModal(false)}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={() => setShowLoginModal(false)}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.sheetWrap} pointerEvents="box-none">
        <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <View style={[styles.iconWrap, { backgroundColor: "rgba(240,224,64,0.12)", borderColor: "rgba(240,224,64,0.3)" }]}>
            <Text style={[styles.logoText, { color: colors.primary }]}>P</Text>
          </View>

          <Text style={[styles.title, { color: colors.foreground, textAlign: "center" }]}>
            {t("signInRequired")}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground, textAlign: "center" }]}>
            {t("signInSubtitle")}
          </Text>

          <TouchableOpacity
            style={[styles.providerBtn, styles.googleBtn]}
            onPress={handleGoogle}
            disabled={loading !== null}
            testID="sign-in-google"
            activeOpacity={0.88}
          >
            {loading === "google" ? (
              <ActivityIndicator color="#1a1a1a" size="small" />
            ) : (
              <>
                <View style={styles.googleIcon}>
                  <Text style={styles.googleG}>G</Text>
                </View>
                <Text style={styles.googleBtnText}>{t("signInWithGoogle")}</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.providerBtn, styles.facebookBtn]}
            onPress={handleFacebook}
            disabled={loading !== null}
            testID="sign-in-facebook"
            activeOpacity={0.88}
          >
            {loading === "facebook" ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <View style={styles.fbIcon}>
                  <Text style={styles.fbF}>f</Text>
                </View>
                <Text style={styles.facebookBtnText}>{t("signInWithFacebook")}</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={[styles.divider, { borderColor: colors.border }]}>
            <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>
              {t("orContinue")}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => setShowLoginModal(false)}
            testID="skip-login"
          >
            <Text style={[styles.skipText, { color: colors.mutedForeground }]}>
              {t("continueWithoutAccount")}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.legalText, { color: "#4a4a6a", textAlign: "center" }]}>
            {t("authLegal")}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.75)",
  },
  sheetWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    alignItems: "center",
    gap: 14,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoText: {
    fontSize: 30,
    fontWeight: "800" as const,
    letterSpacing: -1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  providerBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 14,
    gap: 12,
    minHeight: 52,
  },
  googleBtn: {
    backgroundColor: "#ffffff",
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  googleG: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#4285F4",
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#1a1a1a",
  },
  facebookBtn: {
    backgroundColor: "#1877F2",
  },
  fbIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  fbF: {
    fontSize: 15,
    fontWeight: "800" as const,
    color: "#ffffff",
  },
  facebookBtnText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    width: "100%",
    alignItems: "center",
    paddingTop: 8,
    marginTop: 2,
  },
  dividerText: {
    fontSize: 12,
    marginTop: -16,
    backgroundColor: "transparent",
    paddingHorizontal: 12,
  },
  skipBtn: {
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
  legalText: {
    fontSize: 11,
    lineHeight: 16,
    paddingHorizontal: 8,
  },
});
