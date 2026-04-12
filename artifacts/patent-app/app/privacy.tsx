import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSettings } from "@/context/SettingsContext";
import { useColors } from "@/hooks/useColors";

function SectionHeading({ num, title }: { num: string; title: string }) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeadRow}>
      <View style={[styles.numBadge, { backgroundColor: colors.primary + "22", borderColor: colors.primary + "44" }]}>
        <Text style={[styles.numText, { color: colors.primary }]}>{num}</Text>
      </View>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
    </View>
  );
}

function Para({ text, bold }: { text: string; bold?: boolean }) {
  const colors = useColors();
  const { isRTL } = useSettings();
  return (
    <Text
      style={[
        styles.para,
        { color: bold ? colors.foreground : "#b0b0cc", textAlign: isRTL ? "right" : "left", fontWeight: bold ? "600" : "400" },
      ]}
    >
      {text}
    </Text>
  );
}

function Bullet({ text }: { text: string }) {
  const colors = useColors();
  const { isRTL } = useSettings();
  return (
    <View style={[styles.bulletRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
      <View style={[styles.dot, { backgroundColor: colors.primary }]} />
      <Text style={[styles.bulletText, { color: "#b0b0cc", textAlign: isRTL ? "right" : "left" }]}>{text}</Text>
    </View>
  );
}

function BulletBanned({ text }: { text: string }) {
  const colors = useColors();
  const { isRTL } = useSettings();
  return (
    <View style={[styles.bulletRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
      <View style={[styles.dot, { backgroundColor: "#f04040" }]} />
      <Text style={[styles.bulletText, { color: "#b0b0cc", textAlign: isRTL ? "right" : "left" }]}>{text}</Text>
    </View>
  );
}

function Divider() {
  const colors = useColors();
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

function ThirdPartyRow({ provider, purpose, policy }: { provider: string; purpose: string; policy: string }) {
  const colors = useColors();
  return (
    <View style={[styles.tableRow, { borderColor: colors.border }]}>
      <Text style={[styles.tableCell, styles.tableBold, { color: colors.foreground, flex: 1.2 }]}>{provider}</Text>
      <Text style={[styles.tableCell, { color: "#b0b0cc", flex: 2 }]}>{purpose}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(policy)} style={{ flex: 1 }}>
        <Text style={[styles.tableCell, { color: colors.primary, textDecorationLine: "underline" }]}>Policy</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PrivacyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useSettings();
  const { section } = useLocalSearchParams<{ section?: string }>();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const dir = isRTL ? "row-reverse" : "row";

  const scrollRef = React.useRef<ScrollView>(null);

  const showPrivacy = !section || section === "privacy";
  const showTerms = !section || section === "terms";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border, flexDirection: dir }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="back-btn">
          <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          {section === "terms" ? t("termsOfService") : section === "privacy" ? t("privacyPolicy") : `${t("privacyPolicy")} & ${t("termsOfService")}`}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 60 }]}
        showsVerticalScrollIndicator={false}
      >
        {showPrivacy && (
          <>
            <View style={[styles.hero, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <View style={[styles.heroIcon, { backgroundColor: "rgba(240,224,64,0.1)" }]}>
                <Feather name="shield" size={32} color={colors.primary} />
              </View>
              <Text style={[styles.heroTitle, { color: colors.foreground }]}>{t("privacyPolicy")}</Text>
              <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>Windot · Patent</Text>
              <Text style={[styles.heroDate, { color: colors.mutedForeground }]}>Last updated: April 2026</Text>
            </View>

            <SectionHeading num="1" title="General" />
            <Para text={`Windot ("we", "the Company") operates the Patent application ("the App"). This Privacy Policy explains how we collect, use, and protect your information.`} />

            <SectionHeading num="2" title="Information We Collect" />
            <Para text="Information you provide us:" bold />
            <Bullet text="Full name and email address — when registering with Google" />
            <Bullet text="Username of your choice" />
            <Bullet text="Content you publish (tips, questions, comments)" />
            <Bullet text="Images you upload to posts" />
            <Para text="Information collected automatically:" bold />
            <Bullet text="Anonymous usage data via Google Analytics (screens viewed, session duration, device type, language)" />
            <Bullet text="Google Analytics does not personally identify you and does not link your actions to your identity" />
            <Para text="Information we do not collect:" bold />
            <Bullet text="Geographic location" />
            <Bullet text="Contacts" />
            <Bullet text="Payment information" />

            <SectionHeading num="3" title="How We Use Your Information" />
            <Para text="We use your information solely for the following purposes:" />
            <Bullet text="Operating the app and enabling login" />
            <Bullet text="Displaying your feed, profile, and content" />
            <Bullet text="Sending push notifications you have opted into" />
            <Bullet text="Improving user experience based on anonymous data" />

            <SectionHeading num="4" title="Sharing Information with Third Parties" />
            <Para text="We do not sell, rent, or trade your information. Your data may be stored or transferred only to the following third parties:" />

            <View style={[styles.table, { borderColor: colors.border }]}>
              <View style={[styles.tableHeader, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
                <Text style={[styles.tableCell, styles.tableBold, { color: colors.foreground, flex: 1.2 }]}>Provider</Text>
                <Text style={[styles.tableCell, styles.tableBold, { color: colors.foreground, flex: 2 }]}>Purpose</Text>
                <Text style={[styles.tableCell, styles.tableBold, { color: colors.foreground, flex: 1 }]}>Policy</Text>
              </View>
              <ThirdPartyRow provider="Google OAuth" purpose="Authentication and login" policy="https://policies.google.com/privacy" />
              <ThirdPartyRow provider="Google Analytics" purpose="Anonymous usage analysis" policy="https://policies.google.com/privacy" />
              <ThirdPartyRow provider="Google Cloud Storage" purpose="Storage of uploaded images" policy="https://policies.google.com/privacy" />
              <ThirdPartyRow provider="Expo (Notifications)" purpose="Sending push notifications" policy="https://expo.dev/privacy" />
            </View>

            <SectionHeading num="5" title="Data Storage and Security" />
            <Bullet text="Your data is stored on secure servers" />
            <Bullet text="We use encrypted JWT tokens for authentication" />
            <Bullet text="We are not responsible for security breaches originating from third parties" />

            <SectionHeading num="6" title="Your Rights" />
            <Para text="You have the right to:" />
            <Bullet text="Know what data is stored about you" />
            <Bullet text="Request correction of inaccurate information" />
            <Bullet text="Request deletion of your account and all associated data" />
            <Bullet text="Object to the processing of your information" />
            <Para text="To exercise your rights, contact us:" />
            <TouchableOpacity onPress={() => Linking.openURL("mailto:windot100@gmail.com")}>
              <Text style={[styles.link, { color: colors.primary }]}>windot100@gmail.com</Text>
            </TouchableOpacity>

            <SectionHeading num="7" title="Children" />
            <Para text="The app is open to all ages. We do not knowingly collect information from children under the age of 13 beyond what is required to operate an account. If you are a parent and believe your child has provided information without your consent — contact us and we will delete it immediately." />

            <SectionHeading num="8" title="Changes to This Policy" />
            <Para text="We may update this policy from time to time. Material changes will be announced within the app. Continued use after publication constitutes acceptance of the changes." />

            <SectionHeading num="9" title="Contact" />
            <Para text="Windot · Israel" />
            <TouchableOpacity onPress={() => Linking.openURL("mailto:windot100@gmail.com")}>
              <Text style={[styles.link, { color: colors.primary }]}>windot100@gmail.com</Text>
            </TouchableOpacity>
          </>
        )}

        {showTerms && (
          <>
            {showPrivacy && <Divider />}

            <View style={[styles.hero, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <View style={[styles.heroIcon, { backgroundColor: "rgba(64,224,240,0.1)" }]}>
                <Feather name="file-text" size={32} color="#40e0f0" />
              </View>
              <Text style={[styles.heroTitle, { color: colors.foreground }]}>{t("termsOfService")}</Text>
              <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>Windot · Patent</Text>
              <Text style={[styles.heroDate, { color: colors.mutedForeground }]}>Last updated: April 2026</Text>
            </View>

            <SectionHeading num="1" title="Acceptance of Terms" />
            <Para text="Using the Patent app constitutes full agreement to the terms detailed below. If you do not agree — please discontinue use." />

            <SectionHeading num="2" title="The Service" />
            <Para text="Patent is a social platform for sharing tips, advice, and questions between users. Windot provides the platform only and is not responsible for content published by users." />

            <SectionHeading num="3" title="User Account" />
            <Bullet text="You must provide accurate information when registering" />
            <Bullet text="You are responsible for keeping your account credentials secure" />
            <Bullet text="Creating multiple accounts for the same user is prohibited" />
            <Bullet text="Windot may suspend or delete any account that violates these terms" />

            <SectionHeading num="4" title="Content Rules — What Is and Isn't Allowed" />
            <Para text="Allowed:" bold />
            <Bullet text="Sharing tips and advice from personal experience" />
            <Bullet text="Asking questions and providing answers" />
            <Bullet text="Respectful criticism and substantive discussion" />
            <Para text="Strictly prohibited:" bold />
            <BulletBanned text="Offensive, racist, threatening, or degrading content" />
            <BulletBanned text="Harassment of other users" />
            <BulletBanned text="Publishing personal information of others without their consent" />
            <BulletBanned text="Spam, unauthorized advertising, or disguised promotional content" />
            <BulletBanned text="Content that infringes copyright" />
            <BulletBanned text="Medical, legal, or financial information presented as binding professional advice" />
            <BulletBanned text="Pornographic or explicitly sexual content" />

            <SectionHeading num="5" title="Intellectual Property" />
            <Para text="Your content: You retain full ownership of the content you publish. By publishing content you grant Windot a non-exclusive, royalty-free license to display and distribute your content within the app." />
            <Para text="Our content: The logo, design, code, and app interface are the exclusive property of Windot and are protected by copyright." />

            <SectionHeading num="6" title="Limitation of Liability" />
            <Bullet text="Tips and advice in the app do not constitute professional advice of any kind" />
            <Bullet text="Windot is not liable for any damage caused by acting on content published in the app" />
            <Bullet text='The service is provided "AS IS" without any warranty of continuous availability' />
            <Bullet text="Windot is not responsible for content published by users" />

            <SectionHeading num="7" title="Content Removal and Account Suspension" />
            <Para text="Windot reserves the right to remove any content and suspend any account, at its sole discretion, in cases of violation of these terms — without prior notice." />

            <SectionHeading num="8" title="Changes to the Service" />
            <Para text="Windot may modify, suspend, or discontinue the service at any time. You shall have no claim against Windot for any such changes." />

            <SectionHeading num="9" title="Governing Law and Jurisdiction" />
            <Para text="These terms are subject exclusively to Israeli law. Exclusive jurisdiction is granted to the competent courts in the Tel Aviv district." />

            <SectionHeading num="10" title="Contact" />
            <Para text="Windot · Israel" />
            <TouchableOpacity onPress={() => Linking.openURL("mailto:windot100@gmail.com")}>
              <Text style={[styles.link, { color: "#40e0f0" }]}>windot100@gmail.com</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={[styles.footer, { borderColor: colors.border }]}>
          <Feather name="shield" size={16} color={colors.mutedForeground} />
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            Windot © 2026 · Patent
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: "700", flex: 1, textAlign: "center" },
  content: { padding: 16, gap: 4 },
  hero: {
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    gap: 6,
    marginBottom: 20,
    marginTop: 4,
  },
  heroIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  heroTitle: { fontSize: 20, fontWeight: "800" },
  heroSub: { fontSize: 13 },
  heroDate: { fontSize: 12, marginTop: 2 },
  sectionHeadRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 18, marginBottom: 10 },
  numBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  numText: { fontSize: 12, fontWeight: "800" },
  sectionTitle: { fontSize: 16, fontWeight: "700", flex: 1 },
  para: { fontSize: 14, lineHeight: 22, marginBottom: 6 },
  bulletRow: { alignItems: "flex-start", gap: 10, marginBottom: 5, paddingLeft: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 8, flexShrink: 0 },
  bulletText: { fontSize: 14, lineHeight: 22, flex: 1 },
  divider: { height: 1, marginVertical: 28 },
  table: { borderRadius: 12, borderWidth: 1, overflow: "hidden", marginVertical: 12 },
  tableHeader: { flexDirection: "row", paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1 },
  tableRow: { flexDirection: "row", paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  tableCell: { fontSize: 13, lineHeight: 18 },
  tableBold: { fontWeight: "700" },
  link: { fontSize: 14, fontWeight: "600", textDecorationLine: "underline", marginBottom: 8 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderTopWidth: 1,
    paddingTop: 24,
    marginTop: 16,
  },
  footerText: { fontSize: 12 },
});
