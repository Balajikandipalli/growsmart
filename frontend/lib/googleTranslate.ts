// Google Translate API integration for dynamic content translation
// Note: This uses the free Google Translate API endpoint
// For production, consider using the official Google Cloud Translation API

export type SupportedLanguage = 'en' | 'hi' | 'te';

const LANGUAGE_CODES = {
    en: 'en',
    hi: 'hi',
    te: 'te'
};

// Cache to store translations and avoid redundant API calls
const translationCache = new Map<string, Map<SupportedLanguage, string>>();

/**
 * Translates text using Google Translate API
 * @param text - The text to translate
 * @param targetLang - Target language code (en, hi, te)
 * @param sourceLang - Source language code (defaults to 'en')
 * @returns Translated text
 */
export async function translateText(
    text: string,
    targetLang: SupportedLanguage,
    sourceLang: SupportedLanguage = 'en'
): Promise<string> {
    // Return original text if target language is the same as source
    if (targetLang === sourceLang) {
        return text;
    }

    // Check cache first
    const cacheKey = `${text}_${sourceLang}`;
    if (translationCache.has(cacheKey)) {
        const cached = translationCache.get(cacheKey)?.get(targetLang);
        if (cached) {
            return cached;
        }
    }

    try {
        // Using Google Translate's free API endpoint
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${LANGUAGE_CODES[sourceLang]}&tl=${LANGUAGE_CODES[targetLang]}&dt=t&q=${encodeURIComponent(text)}`;

        const response = await fetch(url);
        const data = await response.json();

        // Extract translated text from response
        const translatedText = data[0]?.map((item: any) => item[0]).join('') || text;

        // Cache the translation
        if (!translationCache.has(cacheKey)) {
            translationCache.set(cacheKey, new Map());
        }
        translationCache.get(cacheKey)?.set(targetLang, translatedText);

        return translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Return original text on error
    }
}

/**
 * Translates multiple texts in batch
 * @param texts - Array of texts to translate
 * @param targetLang - Target language code
 * @param sourceLang - Source language code (defaults to 'en')
 * @returns Array of translated texts
 */
export async function translateBatch(
    texts: string[],
    targetLang: SupportedLanguage,
    sourceLang: SupportedLanguage = 'en'
): Promise<string[]> {
    // Return original texts if target language is the same as source
    if (targetLang === sourceLang) {
        return texts;
    }

    try {
        const translations = await Promise.all(
            texts.map(text => translateText(text, targetLang, sourceLang))
        );
        return translations;
    } catch (error) {
        console.error('Batch translation error:', error);
        return texts; // Return original texts on error
    }
}

/**
 * Clears the translation cache
 */
export function clearTranslationCache(): void {
    translationCache.clear();
}
