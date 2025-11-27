'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translateText, translateBatch, SupportedLanguage } from '@/lib/googleTranslate';

/**
 * Hook for translating dynamic content using Google Translate
 * @param text - Text to translate
 * @param sourceLang - Source language (defaults to 'en')
 * @returns Translated text and loading state
 */
export function useTranslate(text: string, sourceLang: SupportedLanguage = 'en') {
    const { language } = useLanguage();
    const [translatedText, setTranslatedText] = useState(text);
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        if (language === sourceLang) {
            setTranslatedText(text);
            return;
        }

        setIsTranslating(true);
        translateText(text, language as SupportedLanguage, sourceLang)
            .then(setTranslatedText)
            .finally(() => setIsTranslating(false));
    }, [text, language, sourceLang]);

    return { translatedText, isTranslating };
}

/**
 * Hook for translating multiple texts using Google Translate
 * @param texts - Array of texts to translate
 * @param sourceLang - Source language (defaults to 'en')
 * @returns Array of translated texts and loading state
 */
export function useTranslateBatch(texts: string[], sourceLang: SupportedLanguage = 'en') {
    const { language } = useLanguage();
    const [translatedTexts, setTranslatedTexts] = useState(texts);
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        if (language === sourceLang) {
            setTranslatedTexts(texts);
            return;
        }

        setIsTranslating(true);
        translateBatch(texts, language as SupportedLanguage, sourceLang)
            .then(setTranslatedTexts)
            .finally(() => setIsTranslating(false));
    }, [JSON.stringify(texts), language, sourceLang]);

    return { translatedTexts, isTranslating };
}
