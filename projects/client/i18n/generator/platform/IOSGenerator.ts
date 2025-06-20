/**
 * iOS platform generator for String Catalog format
 */

import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import * as path from 'node:path';
import type { GenerationResult } from '../model/GenerationResult.ts';
import type { MetaMessages } from '../model/MetaMessages.ts';
import { Platform } from '../model/Platform.ts';
import type { PlatformGenerator } from '../model/PlatformGenerator.ts';
import { convertToIOSFormat } from '../utils/convertToIOSFormat.ts';
import { writeFile } from '../utils/writeFile.ts';

export const IOSGenerator: PlatformGenerator = {
  async generate(
    metaMessages: MetaMessages[],
    outputDir: string,
  ): Promise<GenerationResult[]> {
    if (metaMessages.length === 0) {
      return [];
    }

    const [firstMeta] = metaMessages;
    if (!firstMeta) {
      console.warn('No meta messages provided for iOS generation.');
      return [];
    }
    
    const iosConfig = firstMeta.meta.generator?.ios;
    if (!iosConfig?.enabled) {
      return [];
    }

    // Create unified catalog structure
    const unifiedCatalog = {
      sourceLanguage: 'en',
      strings: {} as Record<
        string,
        {
          localizations: Record<
            string,
            { stringUnit: { state: string; value: string } }
          >;
        }
      >,
      version: '1.0',
    };

    // Process all locales
    for (const meta of metaMessages) {
      for (const [key, definition] of Object.entries(meta.messages)) {
        // Check if this message should be excluded from iOS
        if (
          typeof definition !== 'string' &&
          definition.exclude?.includes('ios' as Platform)
        ) {
          continue;
        }

        let text: string;
        let actualKey: string;

        if (typeof definition === 'string') {
          text = definition;
          actualKey = key;
        } else {
          text = definition.default;
          actualKey = definition.platforms?.ios?.key || key;
        }

        const iosText = convertToIOSFormat(
          text,
          typeof definition === 'string' ? {} : (definition.variables || {}),
        );

        if (!unifiedCatalog.strings[actualKey]) {
          unifiedCatalog.strings[actualKey] = {
            localizations: {},
          };
        }

        assertDefined(
          unifiedCatalog.strings[actualKey], 
          'Catalogue entry not found'
        ).localizations[meta.meta.locale] = {
          stringUnit: {
            state: 'translated',
            value: iosText,
          },
        };
      }
    }

    const filePath = path.resolve(outputDir, iosConfig.outputPath);
    const content = JSON.stringify(unifiedCatalog, null, 2);
    await writeFile(filePath, content);
    console.log(`✅ Generated unified iOS String Catalog: ${filePath}`);

    return [{
      platform: 'ios' as Platform,
      filePath,
      content,
    }];
  }
};
