import type { Plugin } from 'vite';
import { exit } from 'node:process';
import { existsSync } from 'node:fs';
import path from 'node:path';

export default function close(): Plugin {
  return {
    name: 'deno:sveltekit:exit',
    buildEnd(error) {
      if (error) {
        exit(1);
      }
    },
    closeBundle: () => {
      const manifestFullPath = path.resolve(
        '.svelte-kit/output/server/manifest-full.js',
      );
      const manifestPath = path.resolve(
        '.svelte-kit/output/server/manifest.js',
      );

      const isBuildComplete = existsSync(manifestFullPath) &&
        existsSync(manifestPath);

      if (!isBuildComplete) return;

      exit(0);
    },
  };
}
