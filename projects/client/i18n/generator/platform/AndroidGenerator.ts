/**
 * Android platform generator for XML string resources
 */

import * as path from 'node:path';
import type { GenerationResult } from '../model/GenerationResult.ts';
import type { MetaMessages } from '../model/MetaMessages.ts';
import { Platform } from '../model/Platform.ts';
import type { PlatformGenerator } from '../model/PlatformGenerator.ts';
import { convertToAndroidFormat } from '../utils/convertToAndroidFormat.ts';
import { escapeXml } from '../utils/escapeXml.ts';
import { generateAndroidResourceFolder } from '../utils/generateAndroidResourceFolder.ts';
import { writeFile } from '../utils/writeFile.ts';

function generateContent(metaMessages: MetaMessages): string {
  const entries: string[] = [];

  for (const [key, definition] of Object.entries(metaMessages.messages)) {
    // Check if this message should be excluded from Android
    if (
      typeof definition !== 'string' &&
      definition.exclude?.includes('android' as Platform)
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
      actualKey = definition.platforms?.android?.key || key;
    }

    const androidText = convertToAndroidFormat(
      text,
      typeof definition === 'string' ? {} : (definition.variables || {}),
    );
    const escapedText = escapeXml(androidText);
    entries.push(`    <string name="${actualKey}">${escapedText}</string>`);
  }

  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
${entries.join('\n')}
</resources>`;
}

export const AndroidGenerator: PlatformGenerator = {
  async generate(
    metaMessages: MetaMessages[],
    outputDir: string,
  ): Promise<GenerationResult[]> {
    const results: GenerationResult[] = [];

    // Get all available locales for Android folder naming logic
    const allLocales = metaMessages.map((meta) => meta.meta.locale);

    for (const meta of metaMessages) {
      const config = meta.meta.generator?.android;
      if (!config?.enabled) {
        continue;
      }

      const content = generateContent(meta);

      // Generate Android resource folder name
      const androidFolder = generateAndroidResourceFolder(
        meta.meta.locale,
        allLocales,
      );
      const filePath = path.resolve(
        outputDir,
        config.outputPath.replace('values-{locale}', androidFolder),
      );

      await writeFile(filePath, content);
      console.log(`Generated Android resource: ${filePath}`);

      results.push({
        platform: 'android' as Platform,
        filePath,
        content,
      });
    }

    return results;
  },
};
