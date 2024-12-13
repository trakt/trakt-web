import { availableLocales } from '$lib/features/i18n/index.ts';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAi = new GoogleGenerativeAI(
  Deno.env.get('GEMINI_API_KEY')!,
);

const model = genAi.getGenerativeModel({
  model: 'gemini-1.5-flash-8b',
  generationConfig: {
    responseMimeType: 'application/json',
  },
});

function generatePromptText({
  jsonData,
  targetLocale,
}: {
  jsonData: Record<string, string>;
  targetLocale: string;
}): string {
  return `Translate this JSON data to ${targetLocale} for Trakt Lite, a media-centric app for tracking and discovering movies, TV shows, and more.

          The text should be suitable for users who are interested in tracking and discovering movies, TV shows, and other media content and <3 Trakt!

          For short texts (under 50-100 characters), keep the translation concise. 
          For longer texts, sprinkle in some fun movie/show references (not too many!).

          Important: 

          *   Unless the English text value (not JSON key!) explicitly mentions "movie" or "show," avoid using those specific terms in the translation. The context should be inferred.
          *   Imagine the text might refer to a movie, show, episode, or other media-related term.

          Examples in Trakt Lite:

          *   "Movie": A film like "The Matrix" or "Spirited Away."
          *   "Show": A TV series like "Breaking Bad" or "Stranger Things."
          *   "Episode": A single episode, like "The Rains of Castamere" (Game of Thrones).
          *   "Watchlist": A user's "must-see" list.

          Provide the translated JSON in a valid format, like this:

          {
            "type": "object",
            "properties": {
              "movie": {
                "type": "string"
              },
              "show": {
                "type": "string"
              }
              // ... other properties
            }
          }

          Here's the JSON to translate: ${JSON.stringify(jsonData)}`;
}

async function translateJson(
  jsonData: Record<string, string>,
  targetLocale: string,
): Promise<Record<string, string>> {
  try {
    const result = await model.generateContent(
      generatePromptText({ jsonData, targetLocale }),
    );

    const translatedJsonString = result.response.text();
    return JSON.parse(translatedJsonString);
  } catch (error) {
    console.error(`Error translating to ${targetLocale}:`, error);
    throw error;
  }
}

type TranslationMap = Record<string, string>;

async function loadExistingTranslations(
  locale: string,
): Promise<TranslationMap> {
  const path = `./i18n/messages/${locale}.json`;
  try {
    const content = await Deno.readTextFile(path);
    return JSON.parse(content);
  } catch {
    return {};
  }
}

function findNewKeys(source: TranslationMap, target: TranslationMap): string[] {
  return Object.keys(source).filter((key) => !(key in target));
}

async function bulkTranslateNewKeys(
  sourceMessages: TranslationMap,
  newKeys: string[],
  targetLocale: string,
): Promise<TranslationMap> {
  if (newKeys.length === 0) return {};

  const keysToTranslate = newKeys.reduce((acc, key) => {
    acc[key] = sourceMessages[key] ?? '';
    return acc;
  }, {} as TranslationMap);

  return await translateJson(keysToTranslate, targetLocale);
}

function maintainKeyOrder(
  sourceMessages: TranslationMap,
  translations: TranslationMap,
): TranslationMap {
  // Create ordered object based on source keys
  const ordered = Object.keys(sourceMessages).reduce((acc, key) => {
    acc[key] = translations[key] ?? sourceMessages[key] ?? '';
    return acc;
  }, {} as TranslationMap);

  // Add any additional keys that might exist in translations but not in source
  Object.keys(translations).forEach((key) => {
    if (!(key in ordered)) {
      ordered[key] = translations[key] ?? '';
    }
  });

  return ordered;
}

async function translateAllLocales(): Promise<void> {
  try {
    // Load English source
    const sourceMessages = await loadExistingTranslations('en');

    // Process each locale
    for (const locale of availableLocales.filter((l) => l !== 'en')) {
      console.log(`Processing ${locale}...`);

      // Load existing translations
      const existingTranslations = await loadExistingTranslations(locale);

      // Find new keys
      const newKeys = findNewKeys(sourceMessages, existingTranslations);

      if (newKeys.length === 0) {
        console.log(`No new keys for ${locale}`);
        continue;
      }

      console.log(`Translating ${newKeys.length} new keys for ${locale}`);

      // Translate new keys
      const newTranslations = await bulkTranslateNewKeys(
        sourceMessages,
        newKeys,
        locale,
      );

      // Merge and save
      const updatedTranslations = maintainKeyOrder(sourceMessages, {
        ...existingTranslations,
        ...newTranslations,
      });

      await Deno.writeTextFile(
        `./i18n/messages/${locale}.json`,
        JSON.stringify(updatedTranslations, null, 2) + '\n',
      );

      console.log(`Updated ${locale} with ${newKeys.length} new translations`);
    }
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

if (import.meta.main) {
  await translateAllLocales();
}
