import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSettings } from "@/context/SettingsContext";
import { useColors } from "@/hooks/useColors";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>{title}</Text>
      {children}
    </View>
  );
}

function Para({ text }: { text: string }) {
  const colors = useColors();
  const { isRTL } = useSettings();
  return (
    <Text style={[styles.para, { color: "#b0b0cc", textAlign: isRTL ? "right" : "left" }]}>{text}</Text>
  );
}

export default function PrivacyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useSettings();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const dir = isRTL ? "row-reverse" : "row";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border, flexDirection: dir }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="back-btn">
          <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t("privacyPolicy")} & {t("termsOfService")}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 60 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <View style={[styles.heroIcon, { backgroundColor: "rgba(240,224,64,0.1)" }]}>
            <Feather name="shield" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>{t("aboutApp")}</Text>
          <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
            {t("appVersion")} 1.0.0 · {t("legalSection")}
          </Text>
          <Text style={[styles.heroDate, { color: colors.mutedForeground }]}>
            Last Updated: April 2025
          </Text>
        </View>

        <Section title={t("privacyPolicy")}>
          <Para text="Patent ('we', 'our', or 'us') is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application." />

          <Text style={[styles.subTitle, { color: colors.foreground }]}>Information We Collect</Text>
          <Para text="We may collect information that you provide directly to us, such as when you create an account, submit a tip, or contact us for support. This may include your name, email address, and profile information." />
          <Para text="We automatically collect certain information about your device and how you interact with the app, including device identifiers, log data, and usage statistics to improve our services." />

          <Text style={[styles.subTitle, { color: colors.foreground }]}>How We Use Your Information</Text>
          <Para text="We use the information we collect to provide, maintain, and improve our services, process transactions, send notifications, and respond to your comments and questions." />
          <Para text="We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except as described in this policy." />

          <Text style={[styles.subTitle, { color: colors.foreground }]}>Data Security</Text>
          <Para text="We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction." />

          <Text style={[styles.subTitle, { color: colors.foreground }]}>Third-Party Services</Text>
          <Para text="Our app uses Google Sign-In for authentication. By using these features, you also agree to Google's privacy policy." />
          <Para text="Translation features are powered by Google Translate and MyMemory APIs. Content you translate may be processed by these services." />

          <Text style={[styles.subTitle, { color: colors.foreground }]}>Data Retention</Text>
          <Para text="We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law." />

          <Text style={[styles.subTitle, { color: colors.foreground }]}>Your Rights</Text>
          <Para text="You have the right to access, update, or delete your personal information at any time through your account settings. You may also request a copy of the data we hold about you." />

          <Text style={[styles.subTitle, { color: colors.foreground }]}>Children's Privacy</Text>
          <Para text="Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13." />
        </Section>

        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />

        <Section title={t("termsOfService")}>
          <Para text="By accessing or using Patent, you agree to be bound by these Terms of Service and our Privacy Policy." />

          <Text style={[styles.subTitle, { color: colors.foreground }]}>User Conduct</Text>
          <Para text="You agree to use Patent only for lawful purposes. You must not post content that is harmful, misleading, defamatory, or infringes on others' rights." />
          <Para text="Tips and advice shared on Patent are for informational purposes only. Always consult qualified professionals for medical, legal, financial, or other expert advice." />

          <Text style={[styles.subTitle, { color: colors.foreground }]}>Content Ownership</Text>
          <Para text="You retain ownership of the content you post. By posting, you grant Patent a non-exclusive, royalty-free license to use, display, and distribute your content within the app." />
          <Para text="We reserve the right to remove content that violates our community guidelines or these Terms." />

          <Text style={[styles.subTitle, { color: colors.foreground }]}>Disclaimer of Warranties</Text>
          <Para text="The app is provided 'as is' without any warranties. We do not guarantee that the service will be uninterrupted, error-free, or free from viruses." />
          <Para text="We are not responsible for the accuracy, completeness, or usefulness of any tips or content shared by users." />

          <Text style={[styles.subTitle, { color: colors.foreground }]}>Limitation of Liability</Text>
          <Para text="To the fullest extent permitted by law, Patent shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the app." />

          <Text style={[styles.subTitle, { color: colors.foreground }]}>Changes to Terms</Text>
          <Para text="We reserve the right to modify these terms at any time. We will notify you of significant changes through the app or via email." />

          <Text style={[styles.subTitle, { color: colors.foreground }]}>Contact</Text>
          <Para text="If you have any questions about these Terms or our Privacy Policy, please contact us at: support@patent.app" />
        </Section>

        <View style={[styles.footer, { borderColor: colors.border }]}>
          <Feather name="shield" size={18} color={colors.mutedForeground} />
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            Patent — Your Community Knowledge Hub
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: "700" as const, flex: 1, textAlign: "center" },
  content: { padding: 16 },
  hero: {
    alignItems: "center", borderRadius: 20, borderWidth: 1,
    padding: 28, gap: 8, marginBottom: 28,
  },
  heroIcon: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  heroTitle: { fontSize: 22, fontWeight: "800" as const },
  heroSub: { fontSize: 14 },
  heroDate: { fontSize: 12, marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "800" as const, marginBottom: 16 },
  subTitle: { fontSize: 14, fontWeight: "700" as const, marginTop: 14, marginBottom: 6 },
  para: { fontSize: 14, lineHeight: 22, marginBottom: 8 },
  dividerLine: { height: 1, marginBottom: 28 },
  footer: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, borderTopWidth: 1, paddingTop: 24, marginTop: 8,
  },
  footerText: { fontSize: 13 },
});
