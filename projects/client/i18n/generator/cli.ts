/**
 * CLI script to generate platform-specific i18n resources from meta files
 */

import process from 'node:process';
import { generateFromMeta, Platform } from './I18nGenerator.ts';

async function main() {
  const args = Deno.args;

  if (args.length < 1) {
    console.log(
      'Usage: generate-i18n <meta-file-path> [output-dir] [--platforms platform1,platform2,...]',
    );
    console.log('');
    console.log('Platforms: web, android, ios');
    console.log('');
    console.log('Examples:');
    console.log('  generate-i18n meta/en.json');
    console.log('  generate-i18n meta/en.json ./output');
    console.log(
      '  generate-i18n meta/en.json ./output --platforms web,android',
    );
    console.log('  generate-i18n meta/en.json ./output --platforms ios');
    console.log(
      '  generate-i18n meta/ (processes all .json files in directory with unified iOS)',
    );
    process.exit(1);
  }

  const input = args[0]!;
  let outputDir = args[1] || './.output/generated';
  let platforms: Platform[] | undefined;

  // Parse platform arguments
  const platformIndex = args.indexOf('--platforms');
  if (platformIndex !== -1 && platformIndex + 1 < args.length) {
    const platformArg = args[platformIndex + 1]!;
    const platformStrings = platformArg.split(',').map((p) => p.trim());
    platforms = [];

    for (const platformStr of platformStrings) {
      if (Object.values(Platform).includes(platformStr as Platform)) {
        platforms.push(platformStr as Platform);
      } else {
        console.error(`❌ Invalid platform: ${platformStr}`);
        console.error(`Valid platforms: ${Object.values(Platform).join(', ')}`);
        throw new Error(`Invalid platform: ${platformStr}`);
      }
    }

    // Adjust outputDir if it was actually a platform argument
    if (args[1] === '--platforms') {
      outputDir = './.output/generated';
    }
  }

  try {
    const results = await generateFromMeta(input, outputDir, platforms);

    console.log('\n✅ Generation completed successfully!');
    console.log(`Generated ${results.length} resource file(s):`);
    for (const result of results) {
      console.log(`  ${result.platform}: ${result.filePath}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

main().catch(console.error);
