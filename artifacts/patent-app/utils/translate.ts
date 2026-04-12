const cache: Record<string, string> = {};

export async function translateText(text: string, targetLang: string, sourceLang = "he"): Promise<string> {
  if (targetLang === sourceLang || targetLang === "he") return text;

  const cacheKey = `${sourceLang}|${targetLang}|${text}`;
  if (cache[cacheKey]) return cache[cacheKey];

  const langCode = targetLang === "zh" ? "zh-CN"
    : targetLang === "nb" ? "no"
    : targetLang;

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${langCode}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Translation failed");

  const data = await response.json();
  if (data.responseStatus !== 200) throw new Error(data.responseMessage ?? "Translation error");

  const translated: string = data.responseData.translatedText;
  cache[cacheKey] = translated;
  return translated;
}
