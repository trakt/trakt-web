/**
 * Utility functions for i18n message format conversion and escaping
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// Import types to avoid any usage
type MetaMessageDefinition = {
  default: string;
  description?: string;
  exclude?: string[];
  variables?: Record<string, { type: string }>;
  platforms?: {
    android?: { key?: string };
    ios?: { key?: string };
  };
};

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
  messages: Record<string, string | MetaMessageDefinition>,
  locale: string,
): string {
  const stringCatalog = {
    sourceLanguage: locale,
    version: '1.0',
    strings: {} as Record<
      string,
      {
        comment?: string;
        localizations: Record<
          string,
          { stringUnit: { state: string; value: string } }
        >;
      }
    >,
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
    const messageVariables = typeof definition === 'string'
      ? undefined
      : definition.variables;
    const iosText = convertToIOSFormat(text, messageVariables);

    const stringEntry = {
      comment,
      localizations: {
        [locale]: {
          stringUnit: {
            state: 'translated',
            value: iosText,
          },
        },
      },
    };

    stringCatalog.strings[actualKey] = stringEntry;
  }

  return JSON.stringify(stringCatalog, null, 2);
}

/**
 * Generate Android resource folder name based on locale and available locales
 * Uses language-only folder if it's the only locale for that language, otherwise uses region-specific format
 */
export function generateAndroidResourceFolder(
  locale: string,
  allLocales: string[],
): string {
  const normalizedLocale = locale.toLowerCase();

  // Extract language code (first part before hyphen)
  const languageCode = normalizedLocale.split('-')[0];

  // If it's already a language-only locale (e.g., 'en'), use values-{language}
  if (!normalizedLocale.includes('-')) {
    return `values-${normalizedLocale}`;
  }

  // Handle complex locales with more than 2 parts (e.g., zh-hans-cn)
  const parts = normalizedLocale.split('-');
  if (parts.length > 2) {
    // For complex locales, always use the full locale
    return `values-${normalizedLocale}`;
  }

  // Find all locales for this language (only consider simple language-region locales)
  const sameLanguageLocales = allLocales
    .map((l) => l.toLowerCase())
    .filter((l) => {
      const lParts = l.split('-');
      // Only consider locales with same language code and at most 2 parts
      return lParts[0] === languageCode && lParts.length <= 2;
    });

  // If there's only one simple locale for this language, use just the language code
  if (sameLanguageLocales.length === 1) {
    return `values-${languageCode}`;
  }

  // Otherwise use the specific region format (values-{language}-{REGION})
  if (parts.length === 2 && parts[1]) {
    const [language, region] = parts;
    return `values-${language}-${region.toUpperCase()}`;
  }

  // Fallback for edge cases
  return `values-${normalizedLocale}`;
}
