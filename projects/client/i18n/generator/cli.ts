/**
 * CLI script to generate platform-specific i18n resources from meta files
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import process from 'node:process';
import {
  generateFromMeta,
  generateFromMetaExceptIOS,
  type MetaMessages,
} from './I18nGenerator.ts';
import { convertToIOSFormat, writeFile } from './utils.ts';

async function generateUnifiedIOS(
  metaFiles: string[],
  inputPath: string,
  outputDir: string,
) {
  // Check if any meta file has iOS enabled
  let iosConfig: { enabled: boolean; outputPath: string } | null = null;
  const allMetaData: Array<{ meta: MetaMessages; locale: string }> = [];

  for (const file of metaFiles) {
    const filePath = path.join(inputPath, file);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const metaMessages: MetaMessages = JSON.parse(content);

    if (metaMessages.meta.generator?.ios?.enabled) {
      iosConfig = metaMessages.meta.generator.ios;
    }

    allMetaData.push({ meta: metaMessages, locale: metaMessages.meta.locale });
  }

  if (!iosConfig) {
    return; // No iOS generation needed
  }

  // Generate unified iOS String Catalog file
  const unifiedCatalog = {
    sourceLanguage: 'en',
    version: '1.0',
    strings: {} as Record<string, Record<string, unknown>>,
  };

  // Process all languages
  for (const { meta, locale } of allMetaData) {
    // Get all message keys and add them to the unified catalog
    for (const [key, definition] of Object.entries(meta.messages)) {
      let text: string;
      let actualKey: string;
      let comment: string | undefined;
      let messageVariables: Record<string, { type: string }> | undefined;

      if (typeof definition === 'string') {
        text = definition;
        actualKey = key;
      } else {
        text = definition.default;
        actualKey = definition.platforms?.ios?.key || key;
        comment = definition.description;
        messageVariables = definition.variables;
      }

      // Initialize the string entry if it doesn't exist
      if (!unifiedCatalog.strings[actualKey]) {
        unifiedCatalog.strings[actualKey] = {
          localizations: {},
        };
      }

      const stringEntry = unifiedCatalog.strings[actualKey]!;
      if (comment && !stringEntry.comment) {
        stringEntry.comment = comment;
      }

      // Convert to iOS format
      const iosText = convertToIOSFormat(text, messageVariables);

      // Add localization for this language
      const localizations = stringEntry.localizations as Record<
        string,
        unknown
      >;
      localizations[locale] = {
        stringUnit: {
          state: 'translated',
          value: iosText,
        },
      };
    }
  }

  // Write the unified iOS String Catalog file
  const iosPath = path.resolve(outputDir, iosConfig.outputPath);
  const iosContent = JSON.stringify(unifiedCatalog, null, 2);
  await writeFile(iosPath, iosContent);
  console.log(`\n✅ Generated unified iOS String Catalog: ${iosPath}`);
}

async function main() {
  const args = Deno.args;

  if (args.length < 1) {
    console.log('Usage: generate-i18n <meta-file-path> [output-dir]');
    console.log('');
    console.log('Examples:');
    console.log('  generate-i18n meta/en.json');
    console.log('  generate-i18n meta/en.json ./output');
    console.log(
      '  generate-i18n meta/ (processes all .json files in directory)',
    );
    process.exit(1);
  }

  const input = args[0]!;

  // Determine output directory
  const outputDir = args[1] || './.output/generated';

  try {
    const inputPath = path.resolve(input);
    const stat = await fs.promises.stat(inputPath);

    if (stat.isDirectory()) {
      // Process all .json files in the directory
      const files = await fs.promises.readdir(inputPath);
      const metaFiles = files.filter((file) => file.endsWith('.json'));

      console.log(`Found ${metaFiles.length} meta files in ${inputPath}`);

      // Generate individual platform files (excluding xcstrings for now)
      for (const file of metaFiles) {
        const filePath = path.join(inputPath, file);
        console.log(`\nProcessing ${file}...`);
        await generateFromMetaExceptIOS(filePath, outputDir);
      }

      // Generate unified iOS String Catalog file
      await generateUnifiedIOS(metaFiles, inputPath, outputDir);
    } else {
      // Process single file
      console.log(`Processing ${inputPath}...`);
      await generateFromMeta(inputPath, outputDir);
    }

    console.log('\n✅ Generation completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

main().catch(console.error);
