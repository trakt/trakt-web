/**
 * Conversion script to transform existing Inlang message files
 * into the new meta message format
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

interface InlangMessage {
  $schema?: string;
  [key: string]: string | undefined;
}

interface MetaMessageVariable {
  type: 'string' | 'number' | 'date' | 'time' | 'currency';
  description: string;
  required?: boolean;
}

interface MetaMessageDefinition {
  default: string;
  description?: string;
  variables?: Record<string, MetaMessageVariable>;
}

interface MetaMessages {
  $schema: string;
  meta: {
    locale: string;
    direction: 'ltr' | 'rtl';
    generator: {
      inlang: {
        enabled: boolean;
        outputPath: string;
      };
      android: {
        enabled: boolean;
        outputPath: string;
        resourceName: string;
      };
      ios: {
        enabled: boolean;
        outputPath: string;
      };
    };
  };
  messages: Record<string, MetaMessageDefinition>;
}

// Variable detection patterns
const VARIABLE_PATTERNS = [
  { pattern: /\{(\w+)\}/g, type: 'string' as const },
  { pattern: /\{(\w+),\s*number\}/g, type: 'number' as const },
];

// RTL languages
const RTL_LOCALES = ['ar', 'he', 'fa', 'ur'];

// Extract variables from message text
function extractVariables(text: string): Record<string, MetaMessageVariable> {
  const variables: Record<string, MetaMessageVariable> = {};

  for (const { pattern, type } of VARIABLE_PATTERNS) {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);

    while ((match = regex.exec(text)) !== null) {
      const varName = match[1];

      if (varName && !variables[varName]) {
        variables[varName] = {
          type,
          description: generateVariableDescription(varName, type),
        };
      }
    }
  }

  return variables;
}

// Generate variable descriptions
function generateVariableDescription(varName: string, type: string): string {
  const descriptions: Record<string, string> = {
    name: 'User or entity name',
    title: 'Content title',
    username: 'Username',
    count: 'Numeric count',
    number: 'Numeric value',
    query: 'Search query',
    category: 'Category name',
    service: 'Service name',
    person: 'Person name',
    show: 'Show title',
    season: 'Season number',
    episode: 'Episode number',
    list: 'List name',
    user: 'User reference',
  };

  if (descriptions[varName]) {
    return descriptions[varName];
  }

  return `${type} variable: ${varName}`;
}

// Convert locale code to full locale (e.g., 'en' -> 'en', 'fr-fr' -> 'fr-fr')
function normalizeLocale(filename: string): string {
  return filename.replace('.json', '');
}

// Determine text direction for locale
function getTextDirection(locale: string): 'ltr' | 'rtl' {
  const baseLocale = locale.split('-')[0];
  return baseLocale && RTL_LOCALES.includes(baseLocale) ? 'rtl' : 'ltr';
}

// Convert Inlang messages to Meta format
function convertToMeta(
  inlangData: InlangMessage,
  locale: string,
): MetaMessages {
  const messages: Record<string, MetaMessageDefinition> = {};

  for (const [key, value] of Object.entries(inlangData)) {
    if (key === '$schema' || !value) continue;

    const variables = extractVariables(value);

    const messageDefinition: MetaMessageDefinition = {
      default: value,
      // No automatic description generation - engineers should add these manually
    };

    if (Object.keys(variables).length > 0) {
      messageDefinition.variables = variables;
    }

    messages[key] = messageDefinition;
  }

  return {
    $schema: '../schema/meta-messages.schema.json',
    meta: {
      locale,
      direction: getTextDirection(locale),
      generator: {
        inlang: {
          enabled: true,
          outputPath: './messages/{locale}.json',
        },
        android: {
          enabled: true,
          outputPath: './android/values-{locale}/strings.xml',
          resourceName: 'strings',
        },
        ios: {
          enabled: true,
          outputPath: './ios/Localizable.xcstrings',
        },
      },
    },
    messages,
  };
}

// Main conversion function
async function convertAllMessages(
  messagesDir: string,
  metaDir: string,
): Promise<void> {
  try {
    // Ensure meta directory exists
    await fs.promises.mkdir(metaDir, { recursive: true });

    // Get all JSON files in messages directory
    const files = await fs.promises.readdir(messagesDir);
    const jsonFiles = files.filter((file) => file.endsWith('.json'));

    console.log(`Found ${jsonFiles.length} message files to convert...`);

    for (const file of jsonFiles) {
      const locale = normalizeLocale(file);
      const inputPath = path.join(messagesDir, file);
      const outputPath = path.join(metaDir, file);

      console.log(`Converting ${file} -> meta/${file}...`);

      try {
        // Read existing Inlang file
        const content = await fs.promises.readFile(inputPath, 'utf-8');
        const inlangData: InlangMessage = JSON.parse(content);

        // Convert to meta format
        const metaData = convertToMeta(inlangData, locale);

        // Write meta file
        const metaContent = `${JSON.stringify(metaData, null, 2)}\n`;
        await fs.promises.writeFile(outputPath, metaContent, 'utf-8');

        console.log(
          `  ✅ Converted ${file} (${
            Object.keys(metaData.messages).length
          } messages)`,
        );
      } catch (error) {
        console.error(`  ❌ Error converting ${file}:`, error);
      }
    }

    console.log(`\n🎉 Conversion completed! Meta files saved to ${metaDir}`);
  } catch (error) {
    console.error('Conversion failed:', error);
    throw error;
  }
}

// CLI execution
async function main() {
  const args = Deno.args;

  if (args.length < 2) {
    console.log('Usage: convert-to-meta <messages-dir> <meta-dir>');
    console.log('');
    console.log('Example:');
    console.log(
      '  deno run --allow-read --allow-write convert-to-meta.ts ./messages ./meta',
    );
    Deno.exit(1);
  }

  const messagesDir = path.resolve(args[0]!);
  const metaDir = path.resolve(args[1]!);

  await convertAllMessages(messagesDir, metaDir);
}

// Export for use as module
export { convertAllMessages, convertToMeta };

// Run if called directly
if (import.meta.main) {
  main().catch(console.error);
}
