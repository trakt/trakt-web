/**
 * Generator for creating platform-specific internationalization resources
 * from meta message definitions using a factory pattern.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  convertToAndroidFormat,
  convertToIOSFormat,
  escapeXml,
  generateAndroidResourceFolder,
  writeFile,
} from './utils.ts';

export enum Platform {
  WEB = 'web',
  ANDROID = 'android',
  IOS = 'ios',
}

export interface GenerationResult {
  platform: Platform;
  filePath: string;
  content: string;
}

export interface PlatformGenerator {
  generate(
    metaMessages: MetaMessages[],
    outputDir: string,
  ): Promise<GenerationResult[]>;
}

export interface MetaMessageVariable {
  type: 'string' | 'number' | 'date' | 'time' | 'currency';
  description: string;
  required?: boolean;
}

export interface MetaMessageDefinition {
  default: string;
  description?: string;
  exclude?: Platform[];
  variables?: Record<string, MetaMessageVariable>;
  platforms?: {
    android?: { key?: string };
    ios?: { key?: string };
  };
}

export interface MetaMessages {
  $schema?: string;
  meta: {
    locale: string;
    fallbackLocale?: string;
    direction?: 'ltr' | 'rtl';
    generator?: {
      inlang?: {
        enabled: boolean;
        outputPath: string;
      };
      android?: {
        enabled: boolean;
        outputPath: string;
        resourceName: string;
      };
      ios?: {
        enabled: boolean;
        outputPath: string;
      };
    };
  };
  messages: Record<string, string | MetaMessageDefinition>;
}

/**
 * Web platform generator
 */
class WebGenerator implements PlatformGenerator {
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

      const content = this._generateContent(meta);
      const filePath = path.resolve(
        outputDir,
        config.outputPath.replace('{locale}', meta.meta.locale),
      );

      await writeFile(filePath, JSON.stringify(content, null, 2));
      console.log(`Generated Web resource: ${filePath}`);

      results.push({
        platform: Platform.WEB,
        filePath,
        content: JSON.stringify(content, null, 2),
      });
    }

    return results;
  }

  private _generateContent(metaMessages: MetaMessages): Record<string, string> {
    const result: Record<string, string> = {
      $schema: 'https://inlang.com/schema/inlang-message-format',
    };

    for (const [key, definition] of Object.entries(metaMessages.messages)) {
      // Check if this message should be excluded from Web
      if (typeof definition !== 'string' && definition.exclude?.includes(Platform.WEB)) {
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
}

/**
 * Android platform generator
 */
class AndroidGenerator implements PlatformGenerator {
  async generate(
    metaMessages: MetaMessages[],
    outputDir: string,
  ): Promise<GenerationResult[]> {
    const results: GenerationResult[] = [];

    // Get all available locales for Android folder naming logic
    const allLocales = metaMessages.map(meta => meta.meta.locale);

    for (const meta of metaMessages) {
      const config = meta.meta.generator?.android;
      if (!config?.enabled) {
        continue;
      }

      const content = this._generateContent(meta);
      
      // Generate Android resource folder name
      const androidFolder = generateAndroidResourceFolder(meta.meta.locale, allLocales);
      const filePath = path.resolve(
        outputDir,
        config.outputPath.replace('values-{locale}', androidFolder),
      );

      await writeFile(filePath, content);
      console.log(`Generated Android resource: ${filePath}`);

      results.push({
        platform: Platform.ANDROID,
        filePath,
        content,
      });
    }

    return results;
  }

  private _generateContent(metaMessages: MetaMessages): string {
    const entries: string[] = [];

    for (const [key, definition] of Object.entries(metaMessages.messages)) {
      // Check if this message should be excluded from Android
      if (typeof definition !== 'string' && definition.exclude?.includes(Platform.ANDROID)) {
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
}

/**
 * iOS platform generator for generating a single String Catalog with all locales
 */
class IOSGenerator implements PlatformGenerator {
  async generate(
    metaMessages: MetaMessages[],
    outputDir: string,
  ): Promise<GenerationResult[]> {
    if (metaMessages.length === 0) {
      return [];
    }

    const firstMeta = metaMessages[0]!;
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
        if (typeof definition !== 'string' && definition.exclude?.includes(Platform.IOS)) {
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

        unifiedCatalog.strings[actualKey]!.localizations[meta.meta.locale] = {
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
      platform: Platform.IOS,
      filePath,
      content,
    }];
  }
}

/**
 * Factory for creating platform-specific generators
 */
export class GeneratorFactory {
  static create(platform: Platform): PlatformGenerator {
    switch (platform) {
      case Platform.WEB:
        return new WebGenerator();
      case Platform.ANDROID:
        return new AndroidGenerator();
      case Platform.IOS:
        return new IOSGenerator();
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  static getEnabledPlatforms(metaMessages: MetaMessages): Platform[] {
    const platforms: Platform[] = [];
    const { generator } = metaMessages.meta;

    if (generator?.inlang?.enabled) {
      platforms.push(Platform.WEB);
    }
    if (generator?.android?.enabled) {
      platforms.push(Platform.ANDROID);
    }
    if (generator?.ios?.enabled) {
      platforms.push(Platform.IOS);
    }

    return platforms;
  }
}

/**
 * Main generator class that orchestrates platform-specific generation
 */
export class I18nGenerator {
  constructor(private _metaMessages: MetaMessages[]) {}

  /**
   * Generate resources for specified platforms
   */
  async generatePlatforms(
    platforms: Platform[],
    outputDir: string,
  ): Promise<GenerationResult[]> {
    const results: GenerationResult[] = [];

    for (const platform of platforms) {
      const generator = GeneratorFactory.create(platform);
      const platformResults = await generator.generate(
        this._metaMessages,
        outputDir,
      );
      results.push(...platformResults);
    }

    return results;
  }

  /**
   * Generate resources for all enabled platforms
   */
  generateAll(outputDir: string): Promise<GenerationResult[]> {
    const enabledPlatforms = GeneratorFactory.getEnabledPlatforms(
      this._metaMessages[0]!,
    );
    return this.generatePlatforms(enabledPlatforms, outputDir);
  }
}

/**
 * High-level API for generating resources from files or directories
 */
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
    GeneratorFactory.getEnabledPlatforms(metaMessagesList[0]!);

  return generator.generatePlatforms(targetPlatforms, outputDir);
}
