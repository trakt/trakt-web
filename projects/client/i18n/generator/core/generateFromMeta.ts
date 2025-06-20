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

  if (metaFiles.length === 0) {
    throw new Error(`No JSON files found in directory: ${inputPath}`);
  }

  // Load all meta files
  const metaMessagesList: MetaMessages[] = [];
  for (const file of metaFiles) {
    const filePath = path.join(inputPath, file);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const metaMessages: MetaMessages = JSON.parse(content);
    metaMessagesList.push(metaMessages);
  }

  // Generate for all platforms with all locales
  const generator = new I18nGenerator(metaMessagesList);
  const targetPlatforms = platforms ||
    GeneratorFactory.getEnabledPlatforms(firstItem(metaMessagesList));

  return generator.generatePlatforms(targetPlatforms, outputDir);
}
