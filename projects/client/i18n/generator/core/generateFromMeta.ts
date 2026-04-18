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
import { writeFile } from '../utils/writeFile.ts';
import { I18nGenerator } from './I18nGenerator.ts';

async function readMetaFile(
  inputPath: string,
  file: string,
): Promise<MetaMessages> {
  const filePath = path.join(inputPath, file);
  const content = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

async function pruneStaleLocaleMessages(
  outputDir: string,
  validKeys: ReadonlySet<string>,
): Promise<void> {
  const messagesDir = path.join(outputDir, 'messages');

  let files: string[];
  try {
    files = await fs.promises.readdir(messagesDir);
  } catch {
    return;
  }

  const localeFiles = files.filter(
    (f) => f.endsWith('.json') && f !== 'en.json',
  );

  for (const file of localeFiles) {
    const filePath = path.join(messagesDir, file);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const messages: Record<string, string> = JSON.parse(content);

    const pruned = Object.fromEntries(
      Object.entries(messages).filter(
        ([key]) => key === '$schema' || validKeys.has(key),
      ),
    );

    await writeFile(filePath, JSON.stringify(pruned, null, 2));
    console.log(`Pruned stale keys from: ${path.basename(filePath)}`);
  }
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

  const englishMeta = await readMetaFile(inputPath, englishFile);

  const metaMessagesList: MetaMessages[] = [];
  for (const file of metaFiles) {
    metaMessagesList.push(await readMetaFile(inputPath, file));
  }

  const generator = new I18nGenerator(metaMessagesList);
  const targetPlatforms = platforms ??
    GeneratorFactory.getEnabledPlatforms(firstItem(metaMessagesList));

  const results = await generator.generatePlatforms(targetPlatforms, outputDir);

  const validKeys = new Set(
    Object.entries(englishMeta.messages)
      .filter(([_, def]) => !def.exclude?.includes(Platform.WEB))
      .map(([key]) => key),
  );
  await pruneStaleLocaleMessages(outputDir, validKeys);

  return results;
}
