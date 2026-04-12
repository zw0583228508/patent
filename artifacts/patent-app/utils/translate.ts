const cache: Record<string, string> = {};

async function tryGoogleTranslate(text: string, targetLang: string, sourceLang: string): Promise<string> {
  const tl = targetLang === "zh" ? "zh-CN" : targetLang === "nb" ? "no" : targetLang;
  const sl = sourceLang === "auto" ? "auto" : sourceLang;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Google translate failed");
  const data = await res.json();

  if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error("Bad response");
  const parts: string[] = [];
  for (const chunk of data[0]) {
    if (Array.isArray(chunk) && typeof chunk[0] === "string") parts.push(chunk[0]);
  }
  const result = parts.join("").trim();
  if (!result) throw new Error("Empty result");
  return result;
}

async function tryMyMemory(text: string, targetLang: string, sourceLang: string): Promise<string> {
  const langCode = targetLang === "zh" ? "zh-CN" : targetLang === "nb" ? "no" : targetLang;
  const sl = sourceLang === "auto" ? "he" : sourceLang;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sl}|${langCode}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("MyMemory failed");
  const data = await response.json();
  if (data.responseStatus !== 200) throw new Error(data.responseMessage ?? "Translation error");

  const translated: string = data.responseData.translatedText;
  if (!translated) throw new Error("Empty result");
  return translated;
}

export async function translateText(text: string, targetLang: string, sourceLang = "auto"): Promise<string> {
  if (targetLang === "he") return text;
  if (!text.trim()) return text;

  const cacheKey = `${sourceLang}|${targetLang}|${text}`;
  if (cache[cacheKey]) return cache[cacheKey];

  let result: string;

  try {
    result = await tryGoogleTranslate(text, targetLang, sourceLang);
  } catch {
    try {
      result = await tryMyMemory(text, targetLang, sourceLang === "auto" ? "he" : sourceLang);
    } catch {
      throw new Error("Translation failed");
    }
  }

  cache[cacheKey] = result;
  return result;
}
