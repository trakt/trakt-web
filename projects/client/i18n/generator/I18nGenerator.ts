/**
 * Generator for creating platform-specific internationalization resources
 * from meta message definitions.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  convertToAndroidFormat,
  escapeXml,
  generateXCStrings,
  writeFile,
} from './utils.ts';

export interface MetaMessageVariable {
  type: 'string' | 'number' | 'date' | 'time' | 'currency';
  description: string;
  required?: boolean;
}

export interface MetaMessageDefinition {
  default: string;
  description?: string;
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

export class I18nGenerator {
  constructor(private _meta: MetaMessages) {}

  /**
   * Generate Inlang-compatible JSON resource
   */
  generateInlang(): Record<string, string> {
    const result: Record<string, string> = {
      $schema: 'https://inlang.com/schema/inlang-message-format',
    };

    for (
      const [key, definition] of Object.entries(this._meta.messages)
    ) {
      if (typeof definition === 'string') {
        result[key] = definition;
      } else {
        // Use the default text (single source of truth)
        const text = definition.default;

        // Web always uses the original key (web is the leading platform)
        result[key] = text;
      }
    }

    return result;
  }

  /**
   * Generate Android XML resource
   */
  generateAndroid(): string {
    const locale = this._meta.meta.locale;

    let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
    xml += `<!-- Generated from meta messages for locale: ${locale} -->\n`;
    xml += `<resources>\n`;

    for (
      const [key, definition] of Object.entries(this._meta.messages)
    ) {
      if (typeof definition === 'string') {
        xml += `    <string name="${key}">${escapeXml(definition)}</string>\n`;
      } else {
        // Use the default text (single source of truth)
        const text = definition.default;
        const androidText = convertToAndroidFormat(text, definition.variables);

        // Use platform-specific key if available, otherwise use original key
        const androidKey = definition.platforms?.android?.key || key;

        // Add comment with description if available
        if (definition.description) {
          xml += `    <!-- ${definition.description} -->\n`;
        }

        xml += `    <string name="${androidKey}">${
          escapeXml(androidText)
        }</string>\n`;
      }
    }

    xml += `</resources>\n`;
    return xml;
  }

  /**
   * Generate iOS String Catalog (.xcstrings) file
   */
  generateIOS(): string {
    const locale = this._meta.meta.locale;

    // Extract variables for all messages
    const messageVariables: Record<string, Record<string, { type: string }>> =
      {};
    for (const [key, definition] of Object.entries(this._meta.messages)) {
      if (typeof definition !== 'string' && definition.variables) {
        messageVariables[key] = definition.variables;
      }
    }

    return generateXCStrings(this._meta.messages, locale, messageVariables);
  }

  /**
   * Generate all enabled platform resources except iOS (for batch processing)
   */
  async generateAllExceptIOS(outputDir: string): Promise<void> {
    const { generator } = this._meta.meta;

    if (generator?.inlang?.enabled) {
      const inlangPath = path.resolve(
        outputDir,
        generator.inlang.outputPath.replace(
          '{locale}',
          this._meta.meta.locale,
        ),
      );
      const inlangContent = JSON.stringify(this.generateInlang(), null, 2);
      await writeFile(inlangPath, inlangContent);
      console.log(`Generated Inlang resource: ${inlangPath}`);
    }

    if (generator?.android?.enabled) {
      const androidPath = path.resolve(
        outputDir,
        generator.android.outputPath.replace(
          '{locale}',
          this._meta.meta.locale,
        ),
      );
      const androidContent = this.generateAndroid();
      await writeFile(androidPath, androidContent);
      console.log(`Generated Android resource: ${androidPath}`);
    }
  }

  /**
   * Generate all enabled platform resources
   */
  async generateAll(outputDir: string): Promise<void> {
    const { generator } = this._meta.meta;

    if (generator?.inlang?.enabled) {
      const inlangPath = path.resolve(
        outputDir,
        generator.inlang.outputPath.replace(
          '{locale}',
          this._meta.meta.locale,
        ),
      );
      const inlangContent = JSON.stringify(this.generateInlang(), null, 2);
      await writeFile(inlangPath, inlangContent);
      console.log(`Generated Inlang resource: ${inlangPath}`);
    }

    if (generator?.android?.enabled) {
      const androidPath = path.resolve(
        outputDir,
        generator.android.outputPath.replace(
          '{locale}',
          this._meta.meta.locale,
        ),
      );
      const androidContent = this.generateAndroid();
      await writeFile(androidPath, androidContent);
      console.log(`Generated Android resource: ${androidPath}`);
    }

    if (generator?.ios?.enabled) {
      const iosPath = path.resolve(
        outputDir,
        generator.ios.outputPath.replace(
          '{locale}',
          this._meta.meta.locale,
        ),
      );
      const iosContent = this.generateIOS();
      await writeFile(iosPath, iosContent);
      console.log(`Generated iOS resource: ${iosPath}`);
    }

    if (generator?.ios?.enabled) {
      const iosPath = path.resolve(
        outputDir,
        generator.ios.outputPath.replace(
          '{locale}',
          this._meta.meta.locale,
        ),
      );
      const iosContent = this.generateIOS();
      await writeFile(iosPath, iosContent);
      console.log(`Generated iOS String Catalog: ${iosPath}`);
    }
  }
}

/**
 * CLI function to generate resources from meta files without iOS (for batch processing)
 */
export async function generateFromMetaExceptIOS(
  metaFilePath: string,
  outputDir: string,
): Promise<void> {
  try {
    const metaContent = await fs.promises.readFile(metaFilePath, 'utf-8');
    const metaMessages: MetaMessages = JSON.parse(metaContent);

    const generator = new I18nGenerator(metaMessages);
    await generator.generateAllExceptIOS(outputDir);
  } catch (error) {
    console.error(`Error generating resources from ${metaFilePath}:`, error);
    throw error;
  }
}

/**
 * CLI function to generate resources from meta files
 */
export async function generateFromMeta(
  metaFilePath: string,
  outputDir: string,
): Promise<void> {
  try {
    const metaContent = await fs.promises.readFile(metaFilePath, 'utf-8');
    const metaMessages: MetaMessages = JSON.parse(metaContent);

    const generator = new I18nGenerator(metaMessages);
    await generator.generateAll(outputDir);
  } catch (error) {
    console.error(`Error generating resources from ${metaFilePath}:`, error);
    throw error;
  }
}
