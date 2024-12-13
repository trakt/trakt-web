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

async function translateJsonFile(
  inputFilename: string,
  outputFilename: string,
  targetLocale: string,
): Promise<void> {
  try {
    // Read the JSON file
    const fileData = await Deno.readTextFile(inputFilename);
    const jsonData = JSON.parse(fileData.toString());

    // Translate the JSON object
    const translatedData = await translateJson(jsonData, targetLocale);

    Deno.writeTextFile(
      outputFilename,
      JSON.stringify(translatedData, null, 2) + '\n',
    );

    console.log(`Translation to ${targetLocale} complete!`);
  } catch (error) {
    console.error(`Error translating to ${targetLocale}:`, error);
  }
}

if (import.meta.main) {
  const messagesDir = './i18n/messages';
  const enJsonPath = `${messagesDir}/en.json`;

  for (const locale of availableLocales) {
    const outputFilename = `${messagesDir}/${locale}.json`;
    await translateJsonFile(enJsonPath, outputFilename, locale);
  }
}
