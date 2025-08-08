/**
 * High-level API for generating resources from files or directories
 */

import { firstItem } from '$lib/utils/assert/firstItem.ts';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { GeneratorFactory } from '../factory/GeneratorFactory.ts';
import type { GenerationResult } from '../model/GenerationResult.ts';
import type { MetaMessages } from '../model/MetaMessages.ts';
import { Platform } from '../model/Platform.ts';
import { I18nGenerator } from './I18nGenerator.ts';

async function readMetaFile(
  inputPath: string,
  file: string,
): Promise<MetaMessages> {
  const filePath = path.join(inputPath, file);
  const content = await fs.promises.readFile(filePath, 'utf-8');
  const metaMessages: MetaMessages = JSON.parse(content);

  return metaMessages;
}

export async function generateFromMeta(
  input: string,
  outputDir: string,
  platforms?: Platform[],
): Promise<GenerationResult[]> {
  const inputPath = path.resolve(input);
  const stat = await fs.promises.stat(inputPath);

  if (!stat.isDirectory()) {
    throw new Error('Input must be a directory containing meta files');
  }

  const files = await fs.promises.readdir(inputPath);
  const metaFiles = files.filter((file) => file.endsWith('.json'));
  const englishFile = metaFiles.find((file) => file === 'en.json');

  if (metaFiles.length === 0) {
    throw new Error(`No JSON files found in directory: ${inputPath}`);
  }

  if (!englishFile) {
    throw new Error(
      'en.json not found - it is required as the source of truth for platform configuration',
    );
  }

  // Load all meta files
  const metaMessagesList: MetaMessages[] = [];
  const englishMeta = await readMetaFile(inputPath, englishFile);

  for (const file of metaFiles) {
    const metaMessages = await readMetaFile(inputPath, file);
    metaMessagesList.push(metaMessages);
  }

  if (!englishMeta) {
    throw new Error(
      'en.json could not be read',
    );
  }

  // Augment non-English locale files with platform configuration from en.json
  for (const metaMessages of metaMessagesList) {
    if (metaMessages === englishMeta) {
      continue; // Skip en.json, it already has the configuration
    }

    // For each message in the current locale, copy platform configuration from en.json
    for (const [key, definition] of Object.entries(metaMessages.messages)) {
      const englishDefinition = englishMeta.messages[key];
      if (englishDefinition && typeof englishDefinition === 'object') {
        // Copy exclude, platforms, and variables configuration from English to this locale
        if (typeof definition === 'object') {
          if (englishDefinition.exclude) {
            definition.exclude = [...englishDefinition.exclude];
          }

          if (englishDefinition.platforms) {
            definition.platforms = { ...englishDefinition.platforms };
          }

          if (englishDefinition.variables) {
            definition.variables = { ...englishDefinition.variables };
          }
        }
      }
    }
  }

  // Generate for all platforms with all locales
  const generator = new I18nGenerator(metaMessagesList);
  const targetPlatforms = platforms ||
    GeneratorFactory.getEnabledPlatforms(firstItem(metaMessagesList));

  return generator.generatePlatforms(targetPlatforms, outputDir);
}
