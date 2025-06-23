import type { MetaMessageDefinition } from '../i18n/generator/model/MetaMessageDefinition.ts';
import type { MetaMessages } from '../i18n/generator/model/MetaMessages.ts';
import { I18N_META_DIR } from './_internal/constants.ts';
import { locales } from './_internal/locales.ts';
import { writeJsonFile } from './_internal/writeJsonFile.ts';

async function loadMetaLocale(locale: string): Promise<MetaMessages> {
  const path = `${I18N_META_DIR}/${locale}.json`;
  try {
    const content = await Deno.readTextFile(path);
    return JSON.parse(content);
  } catch {
    // Return empty structure if file doesn't exist
    return {
      $schema: '../schema/meta-messages.schema.json',
      meta: {
        locale,
        direction: 'ltr',
        generator: {
          inlang: { enabled: true, outputPath: './messages/{locale}.json' },
          android: {
            enabled: true,
            outputPath: './android/values-{locale}/strings.xml',
            resourceName: 'strings',
          },
          ios: { enabled: true, outputPath: './ios/Localizable.xcstrings' },
        },
      },
      messages: {},
    };
  }
}

async function cleanseTranslations(): Promise<void> {
  try {
    // Load English meta file as source of truth
    const enMeta = await loadMetaLocale('en');
    const validKeys = new Set(Object.keys(enMeta.messages));

    console.log(
      `Found ${validKeys.size} valid message keys in English meta file`,
    );

    let totalRemovedKeys = 0;
    let totalMissingKeys = 0;

    // Process each locale except 'en'
    for (const locale of locales.filter((l) => l !== 'en')) {
      console.log(`\nProcessing ${locale}...`);

      // Load existing meta file
      const existingMeta = await loadMetaLocale(locale);
      const existingKeys = Object.keys(existingMeta.messages);
      console.log(`Loaded ${existingKeys.length} keys`);

      // Find missing keys (exist in EN but not in this locale)
      const missingKeys = Array.from(validKeys).filter((key) =>
        !existingKeys.includes(key)
      );
      if (missingKeys.length > 0) {
        console.log(
          `⚠️  Missing ${missingKeys.length} keys that exist in English:`,
        );
        missingKeys.slice(0, 5).forEach((key) => console.log(`   - ${key}`));
        if (missingKeys.length > 5) {
          console.log(`   ... and ${missingKeys.length - 5} more`);
        }
        totalMissingKeys += missingKeys.length;
      }

      // Filter out keys that don't exist in English
      const cleanedMessages = Object.entries(existingMeta.messages).reduce(
        (acc, [key, messageDefinition]) => {
          if (validKeys.has(key)) {
            acc[key] = messageDefinition as MetaMessageDefinition;
          } else {
            console.log(`❌ Removing invalid key '${key}' from ${locale}`);
          }
          return acc;
        },
        {} as Record<string, MetaMessageDefinition>,
      );

      // Create cleaned meta structure
      const cleanedMeta: MetaMessages = {
        ...existingMeta,
        messages: cleanedMessages,
      };

      // Write back cleaned meta file
      await writeJsonFile(
        `${I18N_META_DIR}/${locale}.json`,
        cleanedMeta as unknown as Record<string, unknown>,
      );

      const removedCount = Object.keys(existingMeta.messages).length -
        Object.keys(cleanedMessages).length;

      if (removedCount > 0) {
        console.log(`✅ Removed ${removedCount} invalid keys from ${locale}`);
        totalRemovedKeys += removedCount;
      } else {
        console.log(`✅ No invalid keys found in ${locale}`);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Total locales processed: ${locales.length - 1}`);
    console.log(`   Total invalid keys removed: ${totalRemovedKeys}`);
    console.log(`   Total missing keys found: ${totalMissingKeys}`);
    console.log('✅ Cleansing completed successfully!');
  } catch (error) {
    console.error('Error cleaning up translations:', error);
    throw error;
  }
}

if (import.meta.main) {
  await cleanseTranslations();
}
