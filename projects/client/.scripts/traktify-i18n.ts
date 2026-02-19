import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { MetaMessageDefinition } from '../i18n/generator/model/MetaMessageDefinition.ts';
import type { MetaMessages } from '../i18n/generator/model/MetaMessages.ts';
import { I18N_META_DIR } from './_internal/constants.ts';
import { loadMetaFile, type TranslationMap } from './_internal/loadMetaFile.ts';
import { locales } from './_internal/locales.ts';
import { mapToTranslations } from './_internal/mapToTranslations.ts';
import { writeJsonFile } from './_internal/writeJsonFile.ts';

function extractTranslationKeys(
  messages: Record<string, MetaMessageDefinition>,
): TranslationMap {
  const result: TranslationMap = {};
  for (const [key, message] of Object.entries(messages)) {
    result[key] = message.default;
  }
  return result;
}

const genAi = new GoogleGenerativeAI(
  assertDefined(
    Deno.env.get('GEMINI_API_KEY'),
    'GEMINI_API_KEY environment variable must be set',
  ),
);

const model = genAi.getGenerativeModel({
  model: 'gemini-3-flash-preview',
  generationConfig: {
    responseMimeType: 'application/json',
  },
});

// Add this function to generate a prompt for multiple locales with enhanced context
function generateMultiLocalePromptText({
  messages,
  locales,
  localeInstructions,
}: {
  messages: Record<string, MetaMessageDefinition>;
  locales: string[];
  localeInstructions: Record<string, string | undefined>;
}): string {
  // Build context information for each message
  const contextualData = Object.entries(messages).map(
    ([key, message]) => {
      let contextInfo = `"${key}": "${message.default}"`;

      // Add message-level description if available
      if (message.description) {
        contextInfo += ` // Context: ${message.description}`;
      }

      return contextInfo;
    },
  );

  const guidanceInfo = Object.entries(localeInstructions).map((
    [locale, guidance],
  ) => guidance ? `For ${locale}: ${guidance}` : '').filter(Boolean).join(
    '\n          ',
  );

  return `Translate this JSON data to multiple languages for Trakt Web, a media-centric app for tracking and discovering movies, TV shows, and more.

          Target languages: ${locales.join(', ')}

          The text should be suitable for users who are interested in tracking and discovering movies, TV shows, and other media content and <3 Trakt!

          For short texts (under 50-100 characters), keep the translation concise. 
          For longer texts, sprinkle in some fun movie/show references (not too many!).

          ${guidanceInfo}

          Important: 

          *   Do not translate if the context indicates that it should not be translated. Instead use the English text value.
          *   Unless the English text value (not JSON key!) explicitly mentions "movie", "show", "episodes", "lists", etc avoid using those specific terms in the translation. The context should be inferred.
          *   Imagine the text might refer to a movie, show, episode, or other media-related term.
          *   When the JSON key starts with 'job_' it relates to a job one can have in the film and TV industry
          *   Refrain from making assumptions of where media content is consumed (e.g., theaters, streaming services) unless explicitly mentioned in the English text.
          *   Do not translate things between curly braces {like this}, they are placeholders for dynamic content.
          *   If you cannot translate Watchlist short, try using the term "to watch" instead (contextually appropriate).
          *   For navbar links try to keep text short and concise (max 10 characters).
          *   Pay attention to context comments that provide additional information about each message.
          *   Variable descriptions explain what dynamic content will be inserted into placeholders.

          Examples in Trakt Web:

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

          Here's the JSON to translate with context:
          ${contextualData.join('\n          ')}`;
}

async function translateMessages(
  messages: Record<string, MetaMessageDefinition>,
  locales: string[],
  localeInstructions: Record<string, string | undefined>,
): Promise<Record<string, TranslationMap>> {
  const result = await model.generateContent(
    generateMultiLocalePromptText({
      messages,
      locales,
      localeInstructions,
    }),
  );

  const response = JSON.parse(result.response.text());

  // Handle responses by normalizing to an array
  const normalizedResponse = Array.isArray(response) ? response : [response];

  return mapToTranslations({
    messages,
    locales,
    response: normalizedResponse,
  });
}

async function translateAllLocales(): Promise<void> {
  try {
    // Load English source from meta file
    const sourceMeta = await loadMetaFile('en');
    const sourceMessages = extractTranslationKeys(sourceMeta.messages);

    // Get non-English locales
    const targetLocales = locales.filter((l) => l !== 'en');

    // Find new keys for each locale
    const localeNewKeys: Record<string, string[]> = {};
    const localeInstructions: Record<string, string | undefined> = {};
    const allNewKeysSet = new Set<string>();

    for (const locale of targetLocales) {
      // Load existing meta file or create template
      const existingMeta = await loadMetaFileOrCreateTemplate(locale);
      localeInstructions[locale] = existingMeta.meta.guidance;
      const existingTranslations = extractTranslationKeys(
        existingMeta.messages,
      );

      // Find new keys that need translation
      const newKeys = Object.keys(sourceMessages).filter((key) =>
        !(key in existingTranslations)
      );
      localeNewKeys[locale] = newKeys;

      // Add to set of all keys that need translation
      newKeys.forEach((key: string) => allNewKeysSet.add(key));
    }

    const allNewKeys = Array.from(allNewKeysSet);

    if (allNewKeys.length === 0) {
      console.log('No new keys to translate for any locale');
      return;
    }

    // Prepare the data to translate with context
    const keysToTranslate: Record<string, MetaMessageDefinition> = {};
    for (const key of allNewKeys) {
      if (sourceMeta.messages[key]) {
        keysToTranslate[key] = sourceMeta.messages[key];
      }
    }

    console.log(
      `Translating ${allNewKeys.length} unique keys for ${targetLocales.length} locales`,
    );

    // Translate all new keys for all locales in one request
    const allTranslations = await translateMessages(
      keysToTranslate,
      targetLocales,
      localeInstructions,
    );

    // Process and save results for each locale
    for (const locale of targetLocales) {
      // Load existing meta file or create template
      const existingMeta = await loadMetaFileOrCreateTemplate(locale);

      // Filter translations to only include keys needed for this locale
      const newTranslations: TranslationMap = {};
      const localeTranslations = allTranslations[locale] || {};
      const neededKeys = localeNewKeys[locale] || [];

      for (const key of neededKeys) {
        if (localeTranslations[key]) {
          newTranslations[key] = localeTranslations[key];
        }
      }

      if (Object.keys(newTranslations).length === 0) {
        console.log(`No new translations for ${locale}`);
        continue;
      }

      // Update meta file with new translations
      const updatedMeta = updateMetaFileWithTranslations(
        existingMeta,
        newTranslations,
        sourceMeta.messages,
      );

      // Save updated meta file
      await writeJsonFile(
        `${I18N_META_DIR}/${locale}.json`,
        updatedMeta as unknown as Record<string, unknown>,
      );

      console.log(
        `Updated ${locale} meta file with ${
          Object.keys(newTranslations).length
        } new translations`,
      );
    }
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

async function loadMetaFileOrCreateTemplate(
  locale: string,
): Promise<MetaMessages> {
  try {
    return await loadMetaFile(locale);
  } catch {
    // If meta file doesn't exist, create template based on English structure
    console.log(`Creating template meta file for ${locale}`);
    const englishMeta = await loadMetaFile('en');

    return {
      $schema: englishMeta.$schema,
      meta: {
        locale,
        direction: locale === 'ar' ? 'rtl' : 'ltr', // Basic RTL detection
        generator: englishMeta.meta.generator,
      },
      messages: {}, // Start with empty messages
    };
  }
}

function updateMetaFileWithTranslations(
  existingMeta: MetaMessages,
  translations: TranslationMap,
  sourceMessagesWithContext: Record<string, MetaMessageDefinition>,
): MetaMessages {
  const updatedMeta: MetaMessages = {
    ...existingMeta,
    messages: {},
  };

  // Iterate through source messages in their original order to preserve key ordering
  for (
    const [key, sourceMessage] of Object.entries(sourceMessagesWithContext)
  ) {
    if (existingMeta.messages[key]) {
      // Keep existing message, update with translation if available
      updatedMeta.messages[key] = {
        ...existingMeta.messages[key],
        default: translations[key] || existingMeta.messages[key].default,
      };
    } else if (translations[key]) {
      // Add new translated message (variables are only defined in en.json source of truth)
      updatedMeta.messages[key] = {
        default: translations[key],
      };
    }
  }

  // Add any existing messages that aren't in the source (shouldn't happen but safety net)
  for (const [key, existingMessage] of Object.entries(existingMeta.messages)) {
    if (!updatedMeta.messages[key]) {
      updatedMeta.messages[key] = existingMessage;
    }
  }

  return updatedMeta;
}

if (import.meta.main) {
  await translateAllLocales();
}
