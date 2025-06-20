/**
 * Web platform generator for Inlang format
 */

import * as path from 'node:path';
import type { GenerationResult } from '../model/GenerationResult.ts';
import type { MetaMessages } from '../model/MetaMessages.ts';
import { Platform } from '../model/Platform.ts';
import type { PlatformGenerator } from '../model/PlatformGenerator.ts';
import { writeFile } from '../utils/writeFile.ts';

function generateContent(metaMessages: MetaMessages): Record<string, string> {
  const result: Record<string, string> = {
    $schema: 'https://inlang.com/schema/inlang-message-format',
  };

  for (const [key, definition] of Object.entries(metaMessages.messages)) {
    // Check if this message should be excluded from Web
    if (
      typeof definition !== 'string' &&
      definition.exclude?.includes('web' as Platform)
    ) {
      continue;
    }

    if (typeof definition === 'string') {
      result[key] = definition;
    } else {
      result[key] = definition.default;
    }
  }

  return result;
}

export const WebGenerator: PlatformGenerator = {
  async generate(
    metaMessages: MetaMessages[],
    outputDir: string,
  ): Promise<GenerationResult[]> {
    const results: GenerationResult[] = [];

    for (const meta of metaMessages) {
      const config = meta.meta.generator?.inlang;
      if (!config?.enabled) {
        continue;
      }

      const content = generateContent(meta);
      const filePath = path.resolve(
        outputDir,
        config.outputPath.replace('{locale}', meta.meta.locale),
      );

      await writeFile(filePath, JSON.stringify(content, null, 2));
      console.log(`Generated Web resource: ${filePath}`);

      results.push({
        platform: 'web' as Platform,
        filePath,
        content: JSON.stringify(content, null, 2),
      });
    }

    return results;
  },
};
