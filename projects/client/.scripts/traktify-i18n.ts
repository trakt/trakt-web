import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { retry } from '$lib/utils/retry/retry.ts';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { parseArgs } from '@std/cli';
import type { MetaMessageDefinition } from '../i18n/generator/model/MetaMessageDefinition.ts';
import type { MetaMessages } from '../i18n/generator/model/MetaMessages.ts';
import { I18N_META_DIR } from './_internal/constants.ts';
import { loadMetaFile, type TranslationMap } from './_internal/loadMetaFile.ts';
import { locales } from './_internal/locales.ts';
import { mapToTranslations } from './_internal/mapToTranslations.ts';
import { writeJsonFile } from './_internal/writeJsonFile.ts';

const BATCH_SIZE = 50;

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
  model: 'gemini-flash-latest',
  generationConfig: {
    responseMimeType: 'application/json',
  },
});

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
          *   "Smart list": A user-created list with dynamic filters, like "Top Rated Sci-Fi Movies. This should never be translated in the same way as watchlist."

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

async function translateBatch(
  messages: Record<string, MetaMessageDefinition>,
  locales: string[],
  localeInstructions: Record<string, string | undefined>,
): Promise<Record<string, TranslationMap>> {
  return await retry(async () => {
    const result = await model.generateContent(
      generateMultiLocalePromptText({
        messages,
        locales,
        localeInstructions,
      }),
    );

    const text = result.response.text();
    const response = JSON.parse(text);

    // Handle responses by normalizing to an array
    const normalizedResponse = Array.isArray(response) ? response : [response];

    return mapToTranslations({
      messages,
      locales,
      response: normalizedResponse,
    });
  });
}

async function translateAllLocales(): Promise<void> {
  const args = parseArgs(Deno.args, {
    string: ['locales'],
    alias: { locales: 'l' },
  });

  try {
    // Load English source from meta file
    const sourceMeta = await loadMetaFile('en');
    const sourceMessages = extractTranslationKeys(sourceMeta.messages);

    // Get non-English locales
    let targetLocales = locales.filter((l) => l !== 'en');

    // Filter locales if provided via CLI
    if (args.locales) {
      const requestedLocales = args.locales.split(',').map((l: string) =>
        l.trim()
      );
      targetLocales = targetLocales.filter((l) => requestedLocales.includes(l));
      console.log(
        `Filtering to requested locales: ${targetLocales.join(', ')}`,
      );
    }

    if (targetLocales.length === 0) {
      console.log('No valid target locales found');
      return;
    }

    for (const locale of targetLocales) {
      console.log(`\n--- Processing locale: ${locale} ---`);

      // Load existing meta file or create template
      const existingMeta = await loadMetaFileOrCreateTemplate(locale);
      const existingTranslations = extractTranslationKeys(
        existingMeta.messages,
      );

      // Find new keys that need translation
      const newKeys = Object.keys(sourceMessages).filter((key) =>
        !(key in existingTranslations)
      );

      if (newKeys.length === 0) {
        console.log(`No new keys to translate for ${locale}`);
        continue;
      }

      console.log(`Found ${newKeys.length} new keys for ${locale}`);

      // Split new keys into batches
      const batches: string[][] = [];
      for (let i = 0; i < newKeys.length; i += BATCH_SIZE) {
        batches.push(newKeys.slice(i, i + BATCH_SIZE));
      }

      let updatedMeta = existingMeta;

      for (let i = 0; i < batches.length; i++) {
        const batchKeys = batches[i] ?? [];
        console.log(
          `Translating batch ${
            i + 1
          }/${batches.length} (${batchKeys.length} keys)...`,
        );

        // Prepare context for the batch
        const keysToTranslate: Record<string, MetaMessageDefinition> = {};
        for (const key of batchKeys) {
          if (sourceMeta.messages[key]) {
            keysToTranslate[key] = sourceMeta.messages[key];
          }
        }

        const localeInstructions: Record<string, string | undefined> = {
          [locale]: existingMeta.meta.guidance,
        };

        // Translate the batch
        const batchTranslations = await translateBatch(
          keysToTranslate,
          [locale],
          localeInstructions,
        );

        // Update meta with translations from this batch
        updatedMeta = updateMetaFileWithTranslations(
          updatedMeta,
          batchTranslations[locale] || {},
          sourceMeta.messages,
        );

        // Save progress after each batch to avoid data loss
        await writeJsonFile(
          `${I18N_META_DIR}/${locale}.json`,
          updatedMeta as unknown as Record<string, unknown>,
        );
      }

      console.log(`Successfully updated ${locale}`);
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
    messages: { ...existingMeta.messages },
  };

  // Iterate through source messages in their original order to preserve key ordering
  for (const key of Object.keys(sourceMessagesWithContext)) {
    if (translations[key]) {
      // Add new translated message or update existing one
      updatedMeta.messages[key] = {
        ...(updatedMeta.messages[key] || {}),
        default: translations[key],
      };
    }
  }

  return updatedMeta;
}

if (import.meta.main) {
  await translateAllLocales();
}
