import { availableLocales } from '$lib/features/i18n/index.ts';
import { I18N_MESSAGES_DIR } from './_internal/constants.ts';
import { loadLocale } from './_internal/loadLocale.ts';
import { writeJsonFile } from './_internal/writeJsonFile.ts';

async function cleanseTranslations(): Promise<void> {
  try {
    // Load English translations as source of truth
    const enTranslations = await loadLocale('en');
    const validKeys = new Set(Object.keys(enTranslations));

    // Process each locale except 'en'
    for (const locale of availableLocales.filter((l) => l !== 'en')) {
      console.log(`Processing ${locale}...`);

      // Load existing translations
      const existingTranslations = await loadLocale(locale);
      console.log(`Loaded ${Object.keys(existingTranslations).length} keys`);

      // Filter out keys that don't exist in English
      const cleanedTranslations = Object.entries(existingTranslations).reduce(
        (acc, [key, value]) => {
          if (validKeys.has(key)) {
            acc[key] = value;
          } else {
            console.log(`Removing invalid key '${key}' from ${locale}`);
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      // Write back cleaned translations
      await writeJsonFile(
        `${I18N_MESSAGES_DIR}/${locale}.json`,
        cleanedTranslations,
      );

      const removedCount = Object.keys(existingTranslations).length -
        Object.keys(cleanedTranslations).length;

      console.log(`Removed ${removedCount} invalid keys from ${locale}`);
    }
  } catch (error) {
    console.error('Error cleaning up translations:', error);
    throw error;
  }
}

if (import.meta.main) {
  await cleanseTranslations();
}
