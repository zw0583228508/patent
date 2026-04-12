import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSettings } from "@/context/SettingsContext";
import { useColors } from "@/hooks/useColors";

export type MediaAsset = {
  uri: string;
  type: "image" | "video";
};

type Props = {
  media: MediaAsset[];
  onChange: (media: MediaAsset[]) => void;
  compact?: boolean;
};

export default function MediaPicker({ media, onChange, compact = false }: Props) {
  const colors = useColors();
  const { t, isRTL } = useSettings();
  const dir = isRTL ? "row-reverse" : "row";

  async function pickFromGallery() {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: !compact,
      quality: 0.8,
    });
    if (!result.canceled) {
      const newMedia: MediaAsset[] = result.assets.map((a) => ({
        uri: a.uri,
        type: a.type === "video" ? "video" : "image",
      }));
      onChange([...media, ...newMedia]);
    }
  }

  async function pickFromCamera() {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      onChange([...media, { uri: asset.uri, type: asset.type === "video" ? "video" : "image" }]);
    }
  }

  function removeMedia(index: number) {
    onChange(media.filter((_, i) => i !== index));
  }

  if (compact) {
    return (
      <View style={[styles.compactRow, { flexDirection: dir }]}>
        <TouchableOpacity
          style={[styles.compactBtn, { borderColor: colors.border }]}
          onPress={pickFromCamera}
          testID="camera-btn"
        >
          <Feather name="camera" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.compactBtn, { borderColor: colors.border }]}
          onPress={pickFromGallery}
          testID="gallery-btn"
        >
          <Feather name="image" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
        {media.map((item, index) => (
          <TouchableOpacity key={index} style={styles.compactThumb} onPress={() => removeMedia(index)}>
            <Image source={{ uri: item.uri }} style={styles.compactThumbImg} contentFit="cover" />
            {item.type === "video" && (
              <View style={styles.videoOverlay}>
                <Feather name="play" size={10} color="white" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.btnRow, { flexDirection: dir }]}>
        <TouchableOpacity
          style={[styles.mediaBtn, { backgroundColor: colors.surface2, borderColor: colors.border }]}
          onPress={pickFromCamera}
          testID="camera-btn"
        >
          <Feather name="camera" size={16} color={colors.mutedForeground} />
          <Text style={[styles.mediaBtnText, { color: colors.mutedForeground }]}>
            {t("fromCamera")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mediaBtn, { backgroundColor: colors.surface2, borderColor: colors.border }]}
          onPress={pickFromGallery}
          testID="gallery-btn"
        >
          <Feather name="image" size={16} color={colors.mutedForeground} />
          <Text style={[styles.mediaBtnText, { color: colors.mutedForeground }]}>
            {t("fromGallery")}
          </Text>
        </TouchableOpacity>
      </View>

      {media.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.previewScroll}
          contentContainerStyle={{ gap: 8 }}
        >
          {media.map((item, index) => (
            <View key={index} style={styles.previewItem}>
              <Image source={{ uri: item.uri }} style={styles.previewImage} contentFit="cover" />
              {item.type === "video" && (
                <View style={styles.videoOverlay}>
                  <Feather name="play" size={18} color="white" />
                </View>
              )}
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeMedia(index)}
              >
                <Feather name="x" size={11} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  btnRow: { gap: 8 },
  mediaBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 9,
    gap: 6,
  },
  mediaBtnText: { fontSize: 13, fontWeight: "500" as const },
  previewScroll: { marginTop: 2 },
  previewItem: { position: "relative", width: 88, height: 88 },
  previewImage: { width: 88, height: 88, borderRadius: 12 },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  removeBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(200,40,40,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  compactRow: { alignItems: "center", gap: 8 },
  compactBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  compactThumb: { width: 34, height: 34, position: "relative" },
  compactThumbImg: { width: 34, height: 34, borderRadius: 8 },
});
