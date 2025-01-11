import { availableLocales } from '$lib/features/i18n/index.ts';
import { I18N_MESSAGES_DIR } from './_internal/constants.ts';
import { loadLocale } from './_internal/loadLocale.ts';
import { writeJsonFile } from './_internal/writeJsonFile.ts';

// Get the key to delete from the command line arguments
const keyToDelete = Deno.args[0];

if (!keyToDelete) {
  console.error('Please provide a key to delete.');
  Deno.exit(1);
}

async function deleteKey(keyToDelete: string): Promise<void> {
  try {
    // Process each locale except 'en'
    for (const locale of availableLocales.filter((l) => l !== 'en')) {
      console.log(`Processing ${locale}...`);

      // Load existing translations
      const existingTranslations = await loadLocale(locale);
      console.log(`Loaded ${Object.keys(existingTranslations).length} keys`);
      // Delete the key if it exists
      if (keyToDelete in existingTranslations) {
        const { [keyToDelete]: _, ...rest } = existingTranslations;

        await writeJsonFile(
          `${I18N_MESSAGES_DIR}/${locale}.json`,
          rest,
        );
        console.log(`Deleted key '${keyToDelete}' from ${locale}`);
      } else {
        console.log(`Key '${keyToDelete}' not found in ${locale}`);
      }
    }
  } catch (error) {
    console.error('Error deleting key:', error);
    throw error;
  }
}

if (import.meta.main) {
  await deleteKey(keyToDelete);
}
