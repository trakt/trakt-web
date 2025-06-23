/**
 * CLI script to generate platform-specific i18n resources from meta files
 */

import { parseArgs } from '@std/cli/parse-args';
import { generateFromMeta } from './core/generateFromMeta.ts';
import { Platform } from './model/Platform.ts';

function showUsage() {
  console.log(
    'Usage: generate-i18n <meta-file-path> [output-dir] [options]',
  );
  console.log('');
  console.log('Options:');
  console.log('  --platforms, -p  Comma-separated platforms (web,android,ios)');
  console.log('  --watch, -w      Watch for file changes and regenerate');
  console.log('  --help, -h       Show this help');
  console.log('');
  console.log('Examples:');
  console.log('  generate-i18n meta/en.json');
  console.log('  generate-i18n meta/en.json ./output');
  console.log('  generate-i18n meta/en.json ./output --platforms web,android');
  console.log('  generate-i18n meta/en.json ./output --platforms ios');
  console.log('  generate-i18n meta/ --watch');
  console.log(
    '  generate-i18n meta/ (processes all .json files in directory with unified iOS)',
  );
}

async function generateFiles(
  input: string,
  outputDir: string,
  platforms?: Platform[],
) {
  const results = await generateFromMeta(input, outputDir, platforms);

  console.log('\n✅ Generation completed successfully!');
  console.log(`Generated ${results.length} resource file(s):`);
  for (const result of results) {
    console.log(`  ${result.platform}: ${result.filePath}`);
  }
}

async function watchFiles(
  input: string,
  outputDir: string,
  platforms?: Platform[],
) {
  console.log(`👀 Watching ${input} for changes...`);
  console.log(
    `🎯 Platforms: ${platforms?.length ? platforms.join(', ') : 'all enabled'}`,
  );
  console.log('Press Ctrl+C to stop watching\n');

  // Initial generation
  await generateFiles(input, outputDir, platforms);

  const watcher = Deno.watchFs([input]);

  for await (const event of watcher) {
    if (event.kind === 'modify' || event.kind === 'create') {
      // Only react to .json files
      const hasJsonFiles = event.paths.some((path) => path.endsWith('.json'));
      if (hasJsonFiles) {
        console.log(`\n🔄 Files changed: ${event.paths.join(', ')}`);
        console.log('🚀 Regenerating...');

        try {
          await generateFiles(input, outputDir, platforms);
        } catch (error) {
          console.error('❌ Generation failed:', error);
        }
      }
    }
  }
}

async function main() {
  const args = parseArgs(Deno.args, {
    string: ['platforms', 'input', 'output'],
    boolean: ['watch', 'help'],
    alias: {
      p: 'platforms',
      w: 'watch',
      h: 'help',
      i: 'input',
      o: 'output',
    },
    unknown: (arg: string) => {
      if (arg.startsWith('-')) {
        console.error(`❌ Error: Unknown option: ${arg}`);
        showUsage();
        throw new Error(`Unknown option: ${arg}`);
      }
      return true;
    },
  });

  if (args.help) {
    showUsage();
    return;
  }

  const input = args.input;
  const outputDir = args.output ??
    './.output/generated';
  let platforms: Platform[] | undefined;

  if (!input) {
    console.error('❌ Error: Input file or directory is required');
    showUsage();
    throw new Error('Input file or directory is required');
  }

  // Parse platforms
  if (args.platforms) {
    const platformStrings = args.platforms.split(',').map((p) => p.trim());
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
  }

  try {
    if (args.watch) {
      await watchFiles(input, outputDir, platforms);
    } else {
      await generateFiles(input, outputDir, platforms);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

main().catch(console.error);
