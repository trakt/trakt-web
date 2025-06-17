/**
 * Utility functions for i18n message format conversion and escaping
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Convert message with variables metadata to Android format
 * Uses variables definition to determine the correct format specifiers
 */
export function convertToAndroidFormat(
  text: string,
  variables?: Record<string, { type: string }>,
): string {
  if (!variables) {
    // Simple fallback: treat all variables as strings
    return text.replace(/\{(\w+)\}/g, '%s');
  }

  let result = text;
  for (const [varName, varDef] of Object.entries(variables)) {
    const formatSpecifier = varDef.type === 'number' ? '%d' : '%s';
    result = result.replace(
      new RegExp(`\\{${varName}\\}`, 'g'),
      formatSpecifier,
    );
  }

  return result;
}

/**
 * Convert message with variables metadata to iOS format
 * Uses variables definition to determine the correct format specifiers
 */
export function convertToIOSFormat(
  text: string,
  variables?: Record<string, { type: string }>,
): string {
  if (!variables) {
    // Simple fallback: treat all variables as strings
    return text.replace(/\{(\w+)\}/g, '%@');
  }

  let result = text;
  for (const [varName, varDef] of Object.entries(variables)) {
    const formatSpecifier = varDef.type === 'number' ? '%d' : '%@';
    result = result.replace(
      new RegExp(`\\{${varName}\\}`, 'g'),
      formatSpecifier,
    );
  }

  return result;
}

/**
 * Escape XML special characters for Android string resources
 */
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Escape iOS strings special characters
 */
export function escapeIOS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

/**
 * Write file with directory creation
 */
export async function writeFile(
  filePath: string,
  content: string,
): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.promises.mkdir(dir, { recursive: true });
  await fs.promises.writeFile(filePath, content, 'utf-8');
}

/**
 * Generate iOS String Catalog (.xcstrings) format
 * Uses the new Xcode 15+ format for better localization support
 */
export function generateXCStrings(
  messages: Record<string, any>,
  locale: string,
  variables?: Record<string, Record<string, { type: string }>>,
): string {
  const stringCatalog = {
    sourceLanguage: locale,
    version: '1.0',
    strings: {} as Record<string, any>,
  };

  for (const [key, definition] of Object.entries(messages)) {
    let text: string;
    let actualKey: string;
    let comment: string | undefined;

    if (typeof definition === 'string') {
      text = definition;
      actualKey = key;
    } else {
      text = definition.default;
      actualKey = definition.platforms?.ios?.key || key;
      comment = definition.description;
    }

    // Convert to iOS format
    const messageVariables = variables?.[key];
    const iosText = convertToIOSFormat(text, messageVariables);

    const stringEntry: any = {
      localizations: {
        [locale]: {
          stringUnit: {
            state: 'translated',
            value: iosText,
          },
        },
      },
    };

    // Add comment if available
    if (comment) {
      stringEntry.comment = comment;
    }

    stringCatalog.strings[actualKey] = stringEntry;
  }

  return JSON.stringify(stringCatalog, null, 2);
}
