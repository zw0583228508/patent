import { Router } from "express";

const router = Router();

const cache = new Map<string, string>();

async function tryGoogleTranslate(text: string, targetLang: string, sourceLang: string): Promise<string> {
  const tl = targetLang === "zh" ? "zh-CN" : targetLang === "nb" ? "no" : targetLang;
  const sl = sourceLang === "auto" ? "auto" : sourceLang;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible)" },
  });
  if (!res.ok) throw new Error(`Google translate HTTP ${res.status}`);
  const data = (await res.json()) as unknown[][];
  if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error("Bad response format");

  const parts: string[] = [];
  for (const chunk of data[0] as unknown[][]) {
    if (Array.isArray(chunk) && typeof chunk[0] === "string") parts.push(chunk[0]);
  }
  const result = parts.join("").trim();
  if (!result) throw new Error("Empty result");
  return result;
}

async function tryMyMemory(text: string, targetLang: string, sourceLang: string): Promise<string> {
  const langCode = targetLang === "zh" ? "zh-CN" : targetLang === "nb" ? "no" : targetLang;
  const sl = sourceLang === "auto" ? "auto" : sourceLang;
  const pair = sl === "auto" ? `|${langCode}` : `${sl}|${langCode}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`MyMemory HTTP ${response.status}`);
  const data = (await response.json()) as { responseStatus: number; responseData: { translatedText: string } };
  if (data.responseStatus !== 200) throw new Error(`MyMemory error: ${data.responseStatus}`);
  const translated = data.responseData.translatedText;
  if (!translated) throw new Error("Empty result");
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

  const cacheKey = `${sourceLang}|${targetLang}|${text}`;
  if (cache.has(cacheKey)) {
    return res.json({ translated: cache.get(cacheKey) });
  }

  let result: string;

  try {
    result = await tryGoogleTranslate(text, targetLang, sourceLang);
  } catch (e1) {
    try {
      result = await tryMyMemory(text, targetLang, sourceLang);
    } catch (e2) {
      console.error("Translation failed:", e1, e2);
      return res.status(502).json({ error: "Translation service unavailable" });
    }
  }

  cache.set(cacheKey, result);
  if (cache.size > 2000) {
    const firstKey = cache.keys().next().value!;
    cache.delete(firstKey);
  }

  return res.json({ translated: result });
});

export default router;
