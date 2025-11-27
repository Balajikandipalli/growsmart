# Google Translate API Integration

This document explains how the Google Translate API integration works in the GrowSmart application.

## Overview

The application now uses Google Translate API to automatically translate dynamic content (like plant names, descriptions, and other data from the backend) into the user's selected language (English, Hindi, or Telugu).

## How It Works

### 1. Translation Utility (`lib/googleTranslate.ts`)

This file contains the core translation functions:

- **`translateText(text, targetLang, sourceLang)`**: Translates a single text string
- **`translateBatch(texts, targetLang, sourceLang)`**: Translates multiple texts in parallel
- **Caching**: Translations are cached to avoid redundant API calls and improve performance

### 2. React Hooks (`hooks/useTranslate.ts`)

Two custom hooks make it easy to use translations in React components:

- **`useTranslate(text, sourceLang)`**: Translates a single text and returns the translated text + loading state
- **`useTranslateBatch(texts, sourceLang)`**: Translates multiple texts and returns an array of translations + loading state

### 3. Usage in Components

#### Example: PlantCard Component

```tsx
import { useTranslate } from '@/hooks/useTranslate';

const PlantCard = ({ plant }) => {
    // Translate plant name
    const { translatedText: translatedName } = useTranslate(plant.common_name);
    
    // Translate soil type
    const { translatedText: translatedSoilType } = useTranslate('Red Soil');
    
    return (
        <div>
            <h3>{translatedName}</h3>
            <p>Soil: {translatedSoilType}</p>
        </div>
    );
};
```

#### Example: Batch Translation

```tsx
import { useTranslateBatch } from '@/hooks/useTranslate';

const ProductList = ({ products }) => {
    const productNames = products.map(p => p.name);
    const { translatedTexts, isTranslating } = useTranslateBatch(productNames);
    
    if (isTranslating) return <Loader />;
    
    return (
        <div>
            {translatedTexts.map((name, i) => (
                <div key={i}>{name}</div>
            ))}
        </div>
    );
};
```

## Components Updated

The following components now support automatic translation:

1. **PlantCard** (`components/PlantCard.tsx`)
   - Plant names
   - Soil types
   - Button labels (Details)

2. **PlantDetails** (`components/PlantDetails.tsx`)
   - Plant names
   - Family names
   - Growth habits
   - All labels (Family, Year, Growth, Height, etc.)
   - Sunlight, water, and temperature information

## API Details

### Free Google Translate API

The application currently uses the free Google Translate API endpoint:
```
https://translate.googleapis.com/translate_a/single
```

**Pros:**
- Free to use
- No API key required
- Good for development and testing

**Cons:**
- Rate limited
- Not officially supported
- May be blocked or change without notice

### For Production: Google Cloud Translation API

For production use, consider upgrading to the official Google Cloud Translation API:

1. **Create a Google Cloud Project**
2. **Enable the Cloud Translation API**
3. **Create an API Key**
4. **Update the translation utility**:

```typescript
// In lib/googleTranslate.ts
const GOOGLE_TRANSLATE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;

export async function translateText(text, targetLang, sourceLang = 'en') {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: targetLang,
            format: 'text'
        })
    });
    
    const data = await response.json();
    return data.data.translations[0].translatedText;
}
```

5. **Add to `.env.local`**:
```
NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

## Performance Optimization

### Caching

All translations are cached in memory to avoid redundant API calls:

```typescript
// Clear cache if needed
import { clearTranslationCache } from '@/lib/googleTranslate';
clearTranslationCache();
```

### Batch Translations

When translating multiple items, use `useTranslateBatch` instead of multiple `useTranslate` calls:

```tsx
// ❌ Bad - Multiple API calls
const { translatedText: name1 } = useTranslate(plant1.name);
const { translatedText: name2 } = useTranslate(plant2.name);
const { translatedText: name3 } = useTranslate(plant3.name);

// ✅ Good - Single batch call
const names = [plant1.name, plant2.name, plant3.name];
const { translatedTexts } = useTranslateBatch(names);
```

## Supported Languages

Currently supported languages:
- **English** (`en`)
- **Hindi** (`hi`)
- **Telugu** (`te`)

To add more languages:

1. Update `SupportedLanguage` type in `lib/googleTranslate.ts`
2. Add language code to `LANGUAGE_CODES` object
3. Update `Language` type in `lib/translations.ts`
4. Add translations to `translations` object

## Testing

To test translations:

1. Run the application: `npm run dev`
2. Navigate to any page with plant data
3. Use the language switcher in the navbar
4. Observe plant names and descriptions translating automatically

## Troubleshooting

### Translations not working

1. Check browser console for errors
2. Verify internet connection (API requires network access)
3. Check if rate limit has been reached
4. Try clearing the translation cache

### Slow translations

1. Use batch translations for multiple items
2. Consider implementing server-side translation
3. Upgrade to Google Cloud Translation API for better performance

### Mixed languages appearing

This can happen when:
- The source language detection is incorrect
- The text is already in the target language
- The API returns unexpected results

Solution: Always specify the source language explicitly when calling `useTranslate`.

## Future Enhancements

1. **Server-side translation**: Move translations to the backend for better performance
2. **Database caching**: Store translations in a database for persistence
3. **Offline support**: Pre-translate common terms and store locally
4. **User preferences**: Allow users to customize translation behavior
5. **Quality improvements**: Use Google Cloud Translation API for better accuracy
