import { Platform } from "react-native";

const memCache: Record<string, string> = {};

function getApiBase(): string {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}/api-server/api`;
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `${window.location.origin}/api-server/api`;
  }
  return "http://localhost:8080/api";
}

async function translateViaBackend(text: string, targetLang: string, sourceLang: string): Promise<string> {
  const base = getApiBase();
  const res = await fetch(`${base}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, targetLang, sourceLang }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? `Translation failed: ${res.status}`);
  }
  const data = await res.json() as { translated: string };
  return data.translated;
}

export async function translateText(text: string, targetLang: string, sourceLang = "auto"): Promise<string> {
  if (!text.trim()) return text;

  const cacheKey = `${sourceLang}|${targetLang}|${text}`;
  if (memCache[cacheKey]) return memCache[cacheKey];

  const result = await translateViaBackend(text, targetLang, sourceLang);

  memCache[cacheKey] = result;
  return result;
}
