import { Router } from "express";

const router = Router();

const cache = new Map<string, string>();

function mapLangCode(code: string): string {
  const MAP: Record<string, string> = {
    zh: "zh-CN",
    nb: "no",
    "zh-TW": "zh-TW",
  };
  return MAP[code] ?? code;
}

async function fetchWithTimeout(url: string, options?: RequestInit, ms = 6000): Promise<Response> {
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(tid);
  }
}

async function tryGoogleGtx(text: string, targetLang: string, sourceLang: string): Promise<string> {
  const tl = mapLangCode(targetLang);
  const sl = sourceLang === "auto" ? "auto" : mapLangCode(sourceLang);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetchWithTimeout(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`gtx HTTP ${res.status}`);
  const data = (await res.json()) as unknown[][];
  if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error("Bad format");
  const parts: string[] = [];
  for (const chunk of data[0] as unknown[][]) {
    if (Array.isArray(chunk) && typeof chunk[0] === "string") parts.push(chunk[0]);
  }
  const result = parts.join("").trim();
  if (!result) throw new Error("Empty result");
  return result;
}

async function tryGoogleWeb(text: string, targetLang: string, sourceLang: string): Promise<string> {
  const tl = mapLangCode(targetLang);
  const sl = sourceLang === "auto" ? "auto" : mapLangCode(sourceLang);
  const params = new URLSearchParams({
    client: "dict-chrome-ex",
    sl,
    tl,
    q: text,
  });
  const url = `https://clients5.google.com/translate_a/t?${params}`;
  const res = await fetchWithTimeout(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Google web HTTP ${res.status}`);
  const raw = await res.text();
  const data = JSON.parse(raw);

  let result = "";
  if (typeof data === "string") {
    result = data.trim();
  } else if (Array.isArray(data) && typeof data[0] === "string") {
    result = data[0].trim();
  } else if (Array.isArray(data) && Array.isArray(data[0])) {
    result = (data[0] as string[]).join("").trim();
  }
  if (!result) throw new Error("Empty result");
  return result;
}

const LINGVA_HOSTS = [
  "lingva.thedaviddelta.com",
  "lingva.lunar.icu",
  "translate.plausibility.cloud",
];

async function tryLingva(text: string, targetLang: string, sourceLang: string): Promise<string> {
  const tl = mapLangCode(targetLang);
  const sl = sourceLang === "auto" ? "auto" : mapLangCode(sourceLang);
  const errors: string[] = [];
  for (const host of LINGVA_HOSTS) {
    try {
      const url = `https://${host}/api/v1/${sl}/${tl}/${encodeURIComponent(text)}`;
      const res = await fetchWithTimeout(url, {}, 8000);
      if (!res.ok) { errors.push(`${host}: HTTP ${res.status}`); continue; }
      const data = (await res.json()) as { translation?: string; error?: string };
      if (data.error) { errors.push(`${host}: ${data.error}`); continue; }
      const result = data.translation?.trim();
      if (!result) { errors.push(`${host}: empty`); continue; }
      return result;
    } catch (e: any) {
      errors.push(`${host}: ${e?.message ?? e}`);
    }
  }
  throw new Error(`Lingva all failed: ${errors.join(" | ")}`);
}

async function tryMyMemory(text: string, targetLang: string, sourceLang: string): Promise<string> {
  const tl = mapLangCode(targetLang);
  const sl = sourceLang === "auto" ? "en" : mapLangCode(sourceLang);
  const shortText = text.length > 400 ? text.slice(0, 400) : text;
  const pair = `${sl}|${tl}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(shortText)}&langpair=${pair}`;
  const res = await fetchWithTimeout(url, {}, 8000);
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
  const data = (await res.json()) as { responseStatus: number; responseData: { translatedText: string } };
  if (data.responseStatus !== 200) throw new Error(`MyMemory status ${data.responseStatus}`);
  const translated = data.responseData?.translatedText?.trim();
  if (!translated || translated === shortText) throw new Error("Empty or unchanged result");
  return translated;
}

router.post("/", async (req, res) => {
  const { text, targetLang, sourceLang = "auto" } = req.body as {
    text?: string;
    targetLang?: string;
    sourceLang?: string;
  };

  if (!text || !targetLang) {
    return res.status(400).json({ error: "text and targetLang are required" });
  }

  if (!text.trim()) return res.json({ translated: text });

  const cacheKey = `${sourceLang}|${targetLang}|${text.slice(0, 200)}`;
  if (cache.has(cacheKey)) {
    return res.json({ translated: cache.get(cacheKey) });
  }

  const providers = [
    { name: "google-gtx", fn: () => tryGoogleGtx(text, targetLang, sourceLang) },
    { name: "lingva", fn: () => tryLingva(text, targetLang, sourceLang) },
    { name: "google-web", fn: () => tryGoogleWeb(text, targetLang, sourceLang) },
    { name: "mymemory", fn: () => tryMyMemory(text, targetLang, sourceLang) },
  ];

  const errors: string[] = [];
  for (const provider of providers) {
    try {
      const result = await provider.fn();
      cache.set(cacheKey, result);
      if (cache.size > 3000) {
        const firstKey = cache.keys().next().value!;
        cache.delete(firstKey);
      }
      return res.json({ translated: result, provider: provider.name });
    } catch (e: any) {
      const msg = `${provider.name}: ${e?.message ?? e}`;
      errors.push(msg);
      console.warn(`[translate] ${msg}`);
    }
  }

  console.error("[translate] All providers failed:", errors);
  return res.status(502).json({ error: "Translation unavailable — all services failed", details: errors });
});

export default router;
