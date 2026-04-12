import { Platform } from "react-native";

function getBaseUrl() {
  if (Platform.OS === "web") return "/api-server/api";
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}/api-server/api`;
  return "http://localhost:8080/api";
}

export async function uploadImageToCloud(localUri: string): Promise<string> {
  const BASE_URL = getBaseUrl();

  const filename = localUri.split("/").pop() ?? "image.jpg";
  const extension = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const contentTypeMap: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    gif: "image/gif", webp: "image/webp", heic: "image/heic",
  };
  const contentType = contentTypeMap[extension] ?? "image/jpeg";

  const presignedRes = await fetch(`${BASE_URL}/upload/presigned`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, contentType }),
  });

  if (!presignedRes.ok) throw new Error("Failed to get upload URL");

  const { uploadUrl, publicUrl, key } = await presignedRes.json();

  let fileBlob: Blob;
  if (Platform.OS === "web") {
    const res = await fetch(localUri);
    fileBlob = await res.blob();
  } else {
    fileBlob = await new Promise<Blob>((resolve, reject) => {
      fetch(localUri)
        .then((r) => r.blob())
        .then(resolve)
        .catch(reject);
    });
  }

  const formData = new FormData();
  const fields: Record<string, string> = uploadUrl.fields ?? {};
  Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
  formData.append("file", fileBlob, filename);

  const uploadRes = await fetch(uploadUrl.url ?? uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok && uploadRes.status !== 204) {
    throw new Error(`Upload failed: ${uploadRes.status}`);
  }

  const completeRes = await fetch(`${BASE_URL}/upload/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });

  if (completeRes.ok) {
    const { url } = await completeRes.json();
    return url;
  }

  return publicUrl;
}

export async function uploadImages(localUris: string[]): Promise<string[]> {
  const results = await Promise.allSettled(localUris.map(uploadImageToCloud));
  return results.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    console.warn(`Image ${i} upload failed:`, r.reason);
    return localUris[i];
  });
}
