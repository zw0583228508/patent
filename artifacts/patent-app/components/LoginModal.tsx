import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useRef, useState } from "react";
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

import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useColors } from "@/hooks/useColors";

WebBrowser.maybeCompleteAuthSession();

const SSO_TIMEOUT_MS = 60_000;

type LoadingProvider = "google" | null;

export default function LoginModal() {
  const colors = useColors();
  const { t } = useSettings();
  const { showLoginModal, setShowLoginModal } = useAuth();
  const { startSSOFlow } = useSSO();
  const [loading, setLoading] = useState<LoadingProvider>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCancel, setShowCancel] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortedRef = useRef(false);

  function clearTimers() {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    if (cancelRef.current) { clearTimeout(cancelRef.current); cancelRef.current = null; }
  }

  function resetLoading(err?: string) {
    clearTimers();
    setLoading(null);
    setShowCancel(false);
    if (err) setError(err);
  }

  function handleCancel() {
    abortedRef.current = true;
    resetLoading();
  }

  useEffect(() => {
    if (!showLoginModal) {
      resetLoading();
      setError(null);
      abortedRef.current = false;
    }
  }, [showLoginModal]);

  async function handleGoogle() {
    abortedRef.current = false;
    setLoading("google");
    setError(null);
    setShowCancel(false);

    cancelRef.current = setTimeout(() => {
      if (!abortedRef.current) setShowCancel(true);
    }, 8_000);

    timeoutRef.current = setTimeout(() => {
      if (!abortedRef.current) {
        abortedRef.current = true;
        resetLoading("הניסיון לא הושלם. אנא נסה שוב.");
      }
    }, SSO_TIMEOUT_MS);

    try {
      const redirectUrl = Platform.OS === "web"
        ? (typeof window !== "undefined" ? window.location.origin + "/sso-callback" : "https://localhost/sso-callback")
        : AuthSession.makeRedirectUri();

      const result = await startSSOFlow({ strategy: "oauth_google", redirectUrl });

      if (abortedRef.current) return;

      if (result.createdSessionId) {
        await result.setActive!({ session: result.createdSessionId });
        resetLoading();
        setShowLoginModal(false);
      } else if (result.signUp?.status === "missing_requirements" || result.signUp?.status === "complete") {
        resetLoading();
        setShowLoginModal(false);
      } else {
        resetLoading("ההתחברות לא הושלמה. נסה שוב.");
      }
    } catch (err: any) {
      if (abortedRef.current) return;
      console.error("Google SSO error:", err);
      const msg =
        err?.message?.toLowerCase().includes("popup")
          ? "הדפדפן חסם את החלון. אפשר חלונות קופצים ונסה שוב."
          : err?.message?.toLowerCase().includes("network")
          ? "בעיית רשת. בדוק חיבור לאינטרנט ונסה שוב."
          : "שגיאה בהתחברות עם Google. נסה שוב.";
      resetLoading(msg);
    }
  }

  return (
    <Modal
      visible={showLoginModal}
      transparent
      animationType="fade"
      onRequestClose={() => !loading && setShowLoginModal(false)}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={() => !loading && setShowLoginModal(false)}>
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

          {error ? (
            <View style={styles.errorBox}>
              <Text style={[styles.errorText, { color: "#f04040" }]}>{error}</Text>
              <TouchableOpacity onPress={() => setError(null)} style={styles.dismissErr}>
                <Text style={{ color: "#f04040", fontSize: 14, fontWeight: "700" }}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.providerBtn, styles.googleBtn, loading === "google" && styles.googleBtnLoading]}
            onPress={handleGoogle}
            disabled={loading !== null}
            testID="sign-in-google"
            activeOpacity={0.88}
          >
            {loading === "google" ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#555" size="small" />
                <Text style={[styles.googleBtnText, { color: "#555" }]}>מתחבר לגוגל...</Text>
              </View>
            ) : (
              <>
                <View style={styles.googleIconWrap}>
                  <Text style={styles.googleG}>G</Text>
                </View>
                <Text style={styles.googleBtnText}>{t("signInWithGoogle")}</Text>
              </>
            )}
          </TouchableOpacity>

          {showCancel && loading === "google" ? (
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={[styles.cancelText, { color: "#f04040" }]}>ביטול</Text>
            </TouchableOpacity>
          ) : null}

          <View style={[styles.divider, { borderColor: colors.border }]}>
            <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>
              {t("orContinue")}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => setShowLoginModal(false)}
            disabled={loading !== null}
            testID="skip-login"
          >
            <Text style={[styles.skipText, { color: loading ? colors.border : colors.mutedForeground }]}>
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
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.75)" },
  sheetWrap: { ...StyleSheet.absoluteFillObject, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1,
    paddingHorizontal: 24, paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    alignItems: "center", gap: 14,
  },
  handle: { width: 36, height: 4, borderRadius: 2, marginBottom: 4 },
  iconWrap: {
    width: 64, height: 64, borderRadius: 32, borderWidth: 1,
    alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  logoText: { fontSize: 30, fontWeight: "800" as const, letterSpacing: -1 },
  title: { fontSize: 20, fontWeight: "700" as const, lineHeight: 26 },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 4 },
  errorBox: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(240,64,64,0.1)", borderRadius: 10,
    paddingVertical: 8, paddingHorizontal: 12, width: "100%", gap: 8,
  },
  errorText: { fontSize: 13, flex: 1, textAlign: "center" },
  dismissErr: { padding: 2 },
  providerBtn: {
    width: "100%", flexDirection: "row", alignItems: "center",
    justifyContent: "center", borderRadius: 14,
    paddingVertical: 14, gap: 12, minHeight: 52,
  },
  googleBtn: { backgroundColor: "#ffffff" },
  googleBtnLoading: { backgroundColor: "#e8e8e8" },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  googleIconWrap: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 2,
  },
  googleG: { fontSize: 15, fontWeight: "700" as const, color: "#4285F4" },
  googleBtnText: { fontSize: 15, fontWeight: "600" as const, color: "#1a1a1a" },
  cancelBtn: { paddingVertical: 6, paddingHorizontal: 20, marginTop: -6 },
  cancelText: { fontSize: 14, fontWeight: "600" as const, textDecorationLine: "underline" },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth, width: "100%",
    alignItems: "center", paddingTop: 8, marginTop: 2,
  },
  dividerText: {
    fontSize: 12, marginTop: -16,
    backgroundColor: "transparent", paddingHorizontal: 12,
  },
  skipBtn: { paddingVertical: 6 },
  skipText: { fontSize: 14, textDecorationLine: "underline" },
  legalText: { fontSize: 11, lineHeight: 16, paddingHorizontal: 8 },
});
