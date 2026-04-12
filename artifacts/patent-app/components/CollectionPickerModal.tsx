import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
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

const COLLECTION_ICONS: { icon: string; label: string }[] = [
  { icon: "bookmark", label: "Bookmark" },
  { icon: "star", label: "Star" },
  { icon: "heart", label: "Heart" },
  { icon: "zap", label: "Zap" },
  { icon: "coffee", label: "Coffee" },
  { icon: "trending-up", label: "Growth" },
  { icon: "home", label: "Home" },
  { icon: "globe", label: "Globe" },
  { icon: "shopping-bag", label: "Shop" },
  { icon: "book", label: "Book" },
  { icon: "sun", label: "Health" },
  { icon: "briefcase", label: "Work" },
];

const COLLECTION_COLORS = [
  "#f0e040",
  "#40e0f0",
  "#f040a0",
  "#40e040",
  "#f04040",
  "#a040f0",
  "#f09040",
  "#40a0f0",
];

type Props = {
  visible: boolean;
  postId: string;
  onClose: () => void;
};

export default function CollectionPickerModal({ visible, postId, onClose }: Props) {
  const colors = useColors();
  const { t, isRTL } = useSettings();
  const { user } = useAuth();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  const [collections, setCollections] = useState<ApiCollection[]>([]);
  const [savedInIds, setSavedInIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("bookmark");
  const [newColor, setNewColor] = useState("#f0e040");
  const [creating, setCreating] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const dir = isRTL ? "row-reverse" : "row";

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 1, tension: 70, friction: 12, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      if (user) loadCollections();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
      setShowCreate(false);
      setNewName("");
      setNewIcon("bookmark");
      setNewColor("#f0e040");
    }
  }, [visible, user]);

  async function loadCollections() {
    setLoading(true);
    try {
      const [cols, check] = await Promise.all([
        api.collections.list(),
        api.collections.check(postId),
      ]);
      setCollections(cols);
      setSavedInIds(new Set(check.collectionIds));
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function toggleCollection(col: ApiCollection) {
    if (toggling) return;
    setToggling(col.id);
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const inIt = savedInIds.has(col.id);
      if (inIt) {
        await api.collections.removePost(col.id, postId);
        setSavedInIds((s) => { const ns = new Set(s); ns.delete(col.id); return ns; });
        setCollections((c) => c.map((x) => x.id === col.id ? { ...x, postsCount: Math.max(0, x.postsCount - 1) } : x));
        showToast(t("removedFromCollection"), "info", "bookmark");
      } else {
        await api.collections.addPost(col.id, postId);
        setSavedInIds((s) => new Set([...s, col.id]));
        setCollections((c) => c.map((x) => x.id === col.id ? { ...x, postsCount: x.postsCount + 1 } : x));
        showToast(t("addedToCollection"), "success", "bookmark");
      }
    } catch {
      showToast("שגיאה", "error", "alert-circle");
    } finally {
      setToggling(null);
    }
  }

  async function handleCreate() {
    if (!newName.trim() || creating) return;
    setCreating(true);
    try {
      const col = await api.collections.create({ name: newName.trim(), icon: newIcon, color: newColor });
      setCollections((c) => [col, ...c]);
      setShowCreate(false);
      setNewName("");
      showToast(t("collectionCreated"), "success", "folder");
    } catch {
      showToast("שגיאה ביצירת אוסף", "error", "alert-circle");
    } finally {
      setCreating(false);
    }
  }

  const sheetTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  const SHEET_MAX = 480;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Visual backdrop only — no pointer events so it never intercepts touches */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.65)", opacity: backdropAnim }]}
        pointerEvents="none"
      />

      {/* Flex container: Pressable fills the area ABOVE the sheet only — zero overlap */}
      <View style={styles.modalContainer}>
        <Pressable style={styles.dismissArea} onPress={onClose} />

        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              paddingBottom: insets.bottom + 16,
              maxHeight: SHEET_MAX,
              transform: [{ translateY: sheetTranslateY }],
            },
          ]}
        >
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        <View style={[styles.header, { flexDirection: dir }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>{t("saveToCollection")}</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ margin: 32 }} />
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {collections.map((col) => {
              const inIt = savedInIds.has(col.id);
              const isToggling = toggling === col.id;
              return (
                <TouchableOpacity
                  key={col.id}
                  style={[
                    styles.collectionRow,
                    {
                      flexDirection: dir,
                      borderColor: inIt ? col.color + "60" : colors.border,
                      backgroundColor: inIt ? col.color + "10" : colors.surface2,
                    },
                  ]}
                  onPress={() => toggleCollection(col)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.iconCircle, { backgroundColor: col.color + "22", borderColor: col.color + "50" }]}>
                    <Feather name={col.icon as any} size={18} color={col.color} />
                  </View>
                  <View style={{ flex: 1, alignItems: isRTL ? "flex-end" : "flex-start" }}>
                    <Text style={[styles.colName, { color: colors.foreground }]}>{col.name}</Text>
                    <Text style={[styles.colCount, { color: colors.mutedForeground }]}>
                      {col.postsCount} {t("tips")}
                    </Text>
                  </View>
                  {isToggling ? (
                    <ActivityIndicator size="small" color={col.color} />
                  ) : (
                    <View style={[styles.checkCircle, {
                      backgroundColor: inIt ? col.color : "transparent",
                      borderColor: inIt ? col.color : colors.border,
                    }]}>
                      {inIt && <Feather name="check" size={12} color="#0a0a0f" />}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {!showCreate ? (
              <TouchableOpacity
                style={[styles.createBtn, { borderColor: colors.border, flexDirection: dir }]}
                onPress={() => setShowCreate(true)}
                activeOpacity={0.75}
              >
                <Feather name="plus-circle" size={18} color={colors.primary} />
                <Text style={[styles.createBtnText, { color: colors.primary }]}>{t("createNewCollection")}</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.createForm, { borderColor: colors.border, backgroundColor: colors.surface2 }]}>
                <TextInput
                  style={[styles.input, {
                    color: colors.foreground,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    textAlign: isRTL ? "right" : "left",
                  }]}
                  placeholder={t("collectionNamePlaceholder")}
                  placeholderTextColor={colors.mutedForeground}
                  value={newName}
                  onChangeText={setNewName}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleCreate}
                />

                <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{t("iconAndColor")}</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                  <View style={{ flexDirection: "row", gap: 8, paddingVertical: 4 }}>
                    {COLLECTION_ICONS.map((ic) => (
                      <TouchableOpacity
                        key={ic.icon}
                        style={[styles.iconOption, {
                          backgroundColor: newIcon === ic.icon ? newColor + "22" : colors.surface,
                          borderColor: newIcon === ic.icon ? newColor : colors.border,
                        }]}
                        onPress={() => setNewIcon(ic.icon)}
                      >
                        <Feather name={ic.icon as any} size={18} color={newIcon === ic.icon ? newColor : colors.mutedForeground} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: "row", gap: 8, paddingVertical: 4 }}>
                    {COLLECTION_COLORS.map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={[styles.colorDot, {
                          backgroundColor: c,
                          borderWidth: newColor === c ? 3 : 0,
                          borderColor: "#fff",
                        }]}
                        onPress={() => setNewColor(c)}
                      />
                    ))}
                  </View>
                </ScrollView>

                <View style={[styles.createActions, { flexDirection: dir }]}>
                  <TouchableOpacity
                    style={[styles.cancelBtn, { borderColor: colors.border }]}
                    onPress={() => { setShowCreate(false); Keyboard.dismiss(); }}
                  >
                    <Text style={{ color: colors.mutedForeground, fontSize: 14 }}>{t("done")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.confirmBtn, { backgroundColor: newColor, opacity: creating || !newName.trim() ? 0.5 : 1 }]}
                    onPress={handleCreate}
                    disabled={creating || !newName.trim()}
                  >
                    {creating ? (
                      <ActivityIndicator size="small" color="#0a0a0f" />
                    ) : (
                      <Text style={[styles.confirmBtnText]}>{t("createCollection")}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  collectionRow: {
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  colName: {
    fontSize: 14,
    fontWeight: "600",
  },
  colCount: {
    fontSize: 12,
    marginTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  createBtn: {
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    padding: 14,
    marginTop: 4,
  },
  createBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  createForm: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginTop: 8,
    gap: 0,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  iconOption: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  createActions: {
    gap: 10,
    justifyContent: "flex-end",
  },
  cancelBtn: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
  },
  confirmBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0a0a0f",
  },
});
