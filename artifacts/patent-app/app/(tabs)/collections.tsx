import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useToast } from "@/context/ToastContext";
import { useColors } from "@/hooks/useColors";
import { ApiCollection, api } from "@/utils/api";

const COLLECTION_ICONS = [
  "bookmark", "star", "heart", "zap", "coffee", "trending-up",
  "home", "globe", "shopping-bag", "book", "sun", "briefcase",
];
const COLLECTION_COLORS = [
  "#f0e040", "#40e0f0", "#f040a0", "#40e040", "#f04040",
  "#a040f0", "#f09040", "#40a0f0",
];

function CreateSheet({
  visible,
  onClose,
  onCreate,
}: {
  visible: boolean;
  onClose: () => void;
  onCreate: (col: ApiCollection) => void;
}) {
  const colors = useColors();
  const { t, isRTL } = useSettings();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("bookmark");
  const [color, setColor] = useState("#f0e040");
  const [creating, setCreating] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 1, tension: 70, friction: 12, useNativeDriver: true }).start();
    } else {
      Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      setName(""); setIcon("bookmark"); setColor("#f0e040");
    }
  }, [visible]);

  async function handleCreate() {
    if (!name.trim() || creating) return;
    setCreating(true);
    try {
      const col = await api.collections.create({ name: name.trim(), icon, color });
      onCreate(col);
      onClose();
      showToast(t("collectionCreated"), "success", "folder");
    } catch {
      showToast("שגיאה ביצירה", "error", "alert-circle");
    } finally {
      setCreating(false);
    }
  }

  const translateY = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [400, 0] });
  const dir = isRTL ? "row-reverse" : "row";

  if (!visible) return null;

  return (
    <Animated.View style={[styles.createSheet, { backgroundColor: colors.surface, borderTopColor: colors.border, transform: [{ translateY }] }]}>
      <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
      <Text style={[styles.sheetTitle, { color: colors.foreground, textAlign: isRTL ? "right" : "left" }]}>{t("newCollection")}</Text>

      <TextInput
        style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background, textAlign: isRTL ? "right" : "left" }]}
        placeholder={t("collectionNamePlaceholder")}
        placeholderTextColor={colors.mutedForeground}
        value={name}
        onChangeText={setName}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={handleCreate}
      />

      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{t("iconAndColor")}</Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {COLLECTION_ICONS.map((ic) => (
          <TouchableOpacity
            key={ic}
            style={[styles.iconOption, { backgroundColor: icon === ic ? color + "22" : colors.surface2, borderColor: icon === ic ? color : colors.border }]}
            onPress={() => setIcon(ic)}
          >
            <Feather name={ic as any} size={18} color={icon === ic ? color : colors.mutedForeground} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
        {COLLECTION_COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.colorDot, { backgroundColor: c, borderWidth: color === c ? 3 : 0, borderColor: "#fff" }]}
            onPress={() => setColor(c)}
          />
        ))}
      </View>

      <View style={{ flexDirection: dir, gap: 10, justifyContent: "flex-end" }}>
        <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={onClose}>
          <Text style={{ color: colors.mutedForeground }}>{t("done")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.confirmBtn, { backgroundColor: color, opacity: creating || !name.trim() ? 0.5 : 1 }]}
          onPress={handleCreate}
          disabled={creating || !name.trim()}
        >
          {creating ? <ActivityIndicator size="small" color="#0a0a0f" /> : <Text style={styles.confirmBtnText}>{t("createCollection")}</Text>}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

function CollectionCard({ col, onPress, onDelete, isRTL, colors, t }: {
  col: ApiCollection;
  onPress: () => void;
  onDelete: () => void;
  isRTL: boolean;
  colors: ReturnType<typeof useColors>;
  t: (k: any) => string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  function handlePress() {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.96, duration: 60, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start(onPress);
  }

  function confirmDelete() {
    Alert.alert(t("deleteCollection"), `"${col.name}"?`, [
      { text: t("done"), style: "cancel" },
      { text: t("deleteCollection"), style: "destructive", onPress: onDelete },
    ]);
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.surface2, borderColor: col.color + "40" }]}
        onPress={handlePress}
        onLongPress={confirmDelete}
        activeOpacity={0.85}
        delayLongPress={600}
      >
        <View style={[styles.cardIcon, { backgroundColor: col.color + "20", borderColor: col.color + "50" }]}>
          <Feather name={col.icon as any} size={28} color={col.color} />
        </View>
        <Text style={[styles.cardName, { color: colors.foreground, textAlign: isRTL ? "right" : "left" }]} numberOfLines={2}>
          {col.name}
        </Text>
        <Text style={[styles.cardCount, { color: col.color }]}>
          {col.postsCount} {t("tips")}
        </Text>
        <View style={[styles.cardArrow, { transform: [{ scaleX: isRTL ? -1 : 1 }] }]}>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function CollectionsScreen() {
  const colors = useColors();
  const { t, isRTL } = useSettings();
  const { user, requireAuth } = useAuth();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  const [collections, setCollections] = useState<ApiCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const dir = isRTL ? "row-reverse" : "row";

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.collections.list();
      setCollections(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  async function refresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function deleteCollection(id: string) {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await api.collections.delete(id);
      setCollections((c) => c.filter((x) => x.id !== id));
      showToast(t("collectionDeleted"), "info", "trash-2");
    } catch {
      showToast("שגיאה", "error", "alert-circle");
    }
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.empty}>
          <Feather name="lock" size={40} color={colors.mutedForeground} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t("signInRequired")}</Text>
          <TouchableOpacity
            style={[styles.signInBtn, { backgroundColor: colors.primary }]}
            onPress={() => requireAuth(() => {})}
          >
            <Text style={{ color: "#0a0a0f", fontWeight: "700" }}>{t("signIn")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.headerRow, { flexDirection: dir }]}>
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>{t("myCollections")}</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => setShowCreate(true)}
          testID="create-collection-btn"
        >
          <Feather name="plus" size={18} color="#0a0a0f" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={collections}
          keyExtractor={(c) => c.id}
          numColumns={2}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="folder" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{t("noCollections")}</Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t("saveToCollection")}</Text>
              <TouchableOpacity
                style={[styles.signInBtn, { backgroundColor: colors.primary, marginTop: 16 }]}
                onPress={() => setShowCreate(true)}
              >
                <Text style={{ color: "#0a0a0f", fontWeight: "700", fontSize: 14 }}>{t("newCollection")}</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <CollectionCard
                col={item}
                onPress={() => router.push(`/collection/${item.id}` as any)}
                onDelete={() => deleteCollection(item.id)}
                isRTL={isRTL}
                colors={colors}
                t={t}
              />
            </View>
          )}
        />
      )}

      {showCreate && (
        <>
          <TouchableOpacity style={styles.overlay} onPress={() => setShowCreate(false)} activeOpacity={1} />
          <CreateSheet
            visible={showCreate}
            onClose={() => setShowCreate(false)}
            onCreate={(col) => setCollections((c) => [col, ...c])}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  screenTitle: { fontSize: 22, fontWeight: "800" },
  addBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  card: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    minHeight: 140,
    position: "relative",
  },
  cardIcon: {
    width: 52, height: 52, borderRadius: 26,
    borderWidth: 1, alignItems: "center", justifyContent: "center",
  },
  cardName: { fontSize: 14, fontWeight: "700", lineHeight: 18 },
  cardCount: { fontSize: 12, fontWeight: "600" },
  cardArrow: { position: "absolute", bottom: 12, right: 12 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  createSheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderTopWidth: 1, padding: 20, paddingTop: 12,
  },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  sectionLabel: {
    fontSize: 11, fontWeight: "600", letterSpacing: 0.5,
    textTransform: "uppercase", marginBottom: 8,
  },
  input: {
    borderRadius: 12, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 14, marginBottom: 14,
  },
  iconOption: {
    width: 40, height: 40, borderRadius: 10,
    borderWidth: 1, alignItems: "center", justifyContent: "center",
  },
  colorDot: { width: 28, height: 28, borderRadius: 14 },
  cancelBtn: {
    borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 18, paddingVertical: 10, alignItems: "center",
  },
  confirmBtn: {
    flex: 1, borderRadius: 10,
    paddingVertical: 10, alignItems: "center", justifyContent: "center",
  },
  confirmBtnText: { fontSize: 14, fontWeight: "700", color: "#0a0a0f" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptyText: { fontSize: 14, textAlign: "center" },
  signInBtn: { borderRadius: 12, paddingHorizontal: 24, paddingVertical: 11 },
});
