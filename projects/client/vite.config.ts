import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import denoSveltekitExit from './.vite/deno-sveltekit-exit.ts';

import path from 'node:path';
import fs from 'node:fs';

function findGitRoot(dir: string): string {
  if (fs.existsSync(path.join(dir, '.git'))) {
    return dir;
  }

  const parentDir = path.resolve(dir, '..');

  if (parentDir === dir) {
    throw new Error('Git root directory not found!');
  }

  return findGitRoot(parentDir);
}

const MONOREPO_ROOT = findGitRoot(__dirname);

export default defineConfig({
  server: {
    fs: {
      allow: [MONOREPO_ROOT],
    },
  },
  plugins: [
    sveltekit(),
    paraglide({
      project: './i18n/project.inlang',
      outdir: './src/lib/paraglide',
    }),
    denoSveltekitExit(),
  ],

  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
