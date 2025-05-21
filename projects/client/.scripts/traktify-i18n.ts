import { I18N_MESSAGES_DIR } from './_internal/constants.ts';

import { availableLocales } from '$lib/features/i18n/index.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadLocale, type TranslationMap } from './_internal/loadLocale.ts';
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

// Add this function to generate a prompt for multiple locales
function generateMultiLocalePromptText({
  jsonData,
  locales,
}: {
  jsonData: Record<string, string>;
  locales: string[];
}): string {
  return `Translate this JSON data to multiple languages for Trakt Lite, a media-centric app for tracking and discovering movies, TV shows, and more.

          Target languages: ${locales.join(', ')}

          The text should be suitable for users who are interested in tracking and discovering movies, TV shows, and other media content and <3 Trakt!

          For short texts (under 50-100 characters), keep the translation concise. 
          For longer texts, sprinkle in some fun movie/show references (not too many!).

          Important: 

          *   Unless the English text value (not JSON key!) explicitly mentions "movie", "show", "episodes", etc avoid using those specific terms in the translation. The context should be inferred.
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

          Provide the translated JSON in a valid format, with a nested object for each language, like this:

          {
            "fr": {
              "translation_key": "translated text in French"
            },
            "es": {
              "translation_key": "translated text in Spanish"
            }
            // Additional languages...
          }

          Here's the JSON to translate: ${JSON.stringify(jsonData)}`;
}

// Define an interface for the potential response formats
interface TranslationResponse {
  [key: string]: string | TranslationMap;
}

function normalizeTranslationResponse(
  response: TranslationResponse,
): TranslationMap {
  // Check if the response has numeric keys (like "0") containing the actual translations
  const keys = Object.keys(response);

  if (keys.length === 1 && keys[0] && /^\d+$/.test(keys[0])) {
    // We have a nested response under a numeric key
    console.warn(
      `⚠️ WARNING: Received nested translation response under key "${
        keys[0]
      }". Lifting nested keys.`,
    );
    return response[keys[0]] as TranslationMap;
  }

  return response as TranslationMap;
}

// Add this function to translate to multiple locales at once
async function translateJsonMultiLocale(
  jsonData: Record<string, string>,
  locales: string[],
): Promise<Record<string, TranslationMap>> {
  try {
    const result = await model.generateContent(
      generateMultiLocalePromptText({ jsonData, locales }),
    );

    const translatedJsonString = result.response.text();

    // Handle the case where response is an array of objects
    const parsedResponse = (() => {
      try {
        const rawParsed = JSON.parse(translatedJsonString);

        // Check if the response is an array
        if (Array.isArray(rawParsed) && rawParsed.length > 0) {
          console.log('Detected array response, extracting first item');
          // Use the first object in the array
          return rawParsed[0];
        } else {
          // Regular object response
          return rawParsed;
        }
      } catch (error) {
        console.error('Failed to parse response JSON:', error);
        throw error;
      }
    })();

    const translations: Record<string, TranslationMap> = {};

    // Process each locale in the response
    for (const locale of locales) {
      if (!parsedResponse[locale]) {
        console.warn(
          `⚠️ WARNING: Missing locale ${locale} in translation response`,
        );
        translations[locale] = {};
        continue;
      }

      // Normalize the response for this locale
      const normalizedResponse = normalizeTranslationResponse(
        parsedResponse[locale],
      );

      // Verify all expected keys exist in the response
      const missingKeys = Object.keys(jsonData).filter((key) =>
        !(key in normalizedResponse)
      );

      if (missingKeys.length > 0) {
        console.warn(
          `⚠️ WARNING: Missing ${missingKeys.length} keys in translation response for ${locale}: ${
            missingKeys.join(', ')
          }`,
        );

        // Add missing keys back using source values
        missingKeys.forEach((key) => {
          normalizedResponse[key] = assertDefined(
            jsonData[key],
            `Key ${key} not found in source messages`,
          );
        });
      }

      translations[locale] = normalizedResponse;
    }

    return translations;
  } catch (error) {
    console.error('Error translating to multiple locales:', error);
    throw error;
  }
}

function findNewKeys(source: TranslationMap, target: TranslationMap): string[] {
  return Object.keys(source).filter((key) => !(key in target));
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

    // Get non-English locales
    const targetLocales = availableLocales.filter((l) => l !== 'en');

    // Find new keys for each locale
    const localeNewKeys: Record<string, string[]> = {};
    const allNewKeysSet = new Set<string>();

    for (const locale of targetLocales) {
      // Load existing translations
      const existingTranslations = await loadLocale(locale);

      // Find new keys
      const newKeys = findNewKeys(sourceMessages, existingTranslations);
      localeNewKeys[locale] = newKeys;

      // Add to set of all keys that need translation
      newKeys.forEach((key) => allNewKeysSet.add(key));
    }

    const allNewKeys = Array.from(allNewKeysSet);

    if (allNewKeys.length === 0) {
      console.log('No new keys to translate for any locale');
      return;
    }

    // Prepare the data to translate
    const keysToTranslate = allNewKeys.reduce((acc, key) => {
      acc[key] = sourceMessages[key] ?? '';
      return acc;
    }, {} as TranslationMap);

    console.log(
      `Translating ${allNewKeys.length} unique keys for ${targetLocales.length} locales`,
    );

    // Translate all new keys for all locales in one request
    const allTranslations = await translateJsonMultiLocale(
      keysToTranslate,
      targetLocales,
    );

    // Process and save results for each locale
    for (const locale of targetLocales) {
      // Get existing translations
      const existingTranslations = await loadLocale(locale);

      // Filter translations to only include keys needed for this locale
      const newTranslations = Object.fromEntries(
        Object.entries(allTranslations[locale] || {})
          .filter(([key]) => localeNewKeys[locale]?.includes(key) || false),
      );

      if (Object.keys(newTranslations).length === 0) {
        console.log(`No new translations for ${locale}`);
        continue;
      }

      // Merge and save
      const updatedTranslations = maintainKeyOrder(sourceMessages, {
        ...existingTranslations,
        ...newTranslations,
      });

      await writeJsonFile(
        `${I18N_MESSAGES_DIR}/${locale}.json`,
        updatedTranslations,
      );

      console.log(
        `Updated ${locale} with ${
          Object.keys(newTranslations).length
        } new translations`,
      );
    }
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

if (import.meta.main) {
  await translateAllLocales();
}
