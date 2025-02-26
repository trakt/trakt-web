import { I18N_MESSAGES_DIR } from './_internal/constants.ts';

import { availableLocales } from '$lib/features/i18n/index.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadLocale, TranslationMap } from './_internal/loadLocale.ts';
import { writeJsonFile } from './_internal/writeJsonFile.ts';

const genAi = new GoogleGenerativeAI(
  assertDefined(
    Deno.env.get('GEMINI_API_KEY'),
    'GEMINI_API_KEY environment variable must be set',
  ),
);

const model = genAi.getGenerativeModel({
  model: 'gemini-2.0-flash-lite',
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
          *   When the JSON key starts with 'job_' it relates to a job one can have in the film and TV industry
          *   Refrain from making assumptions of where media content is consumed (e.g., theaters, streaming services) unless explicitly mentioned in the English text.
          *   Do not translate things between curly braces {like this}, they are placeholders for dynamic content.
          *   If you cannot translate Watchlist short, try using the term "to watch" instead (contextually appropriate).
          *   For navbar links try to keep text short and concise (max 10 characters).

          Examples in Trakt Lite:

          *   "Movie": A film like "The Matrix" or "Spirited Away."
          *   "Show": A TV series like "Breaking Bad" or "Stranger Things."
          *   "Episode": A single episode, like "The Rains of Castamere" (Game of Thrones).
          *   "Watchlist": A user's "must-see" list.

          Provide the translated JSON in a valid format, like this:

          {
            "translation_key": "translated text",
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
    const sourceMessages = await loadLocale('en');

    // Process each locale
    for (const locale of availableLocales.filter((l) => l !== 'en')) {
      console.log(`Processing ${locale}...`);

      // Load existing translations
      const existingTranslations = await loadLocale(locale);

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

      await writeJsonFile(
        `${I18N_MESSAGES_DIR}/${locale}.json`,
        updatedTranslations,
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
