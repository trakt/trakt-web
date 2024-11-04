import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import denoSveltekitExit from './.vite/deno-sveltekit-exit.ts';
import { Environment } from '@trakt/api';

import path from 'node:path';
import fs from 'node:fs';
import process from 'node:process';

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
  define: {
    'TRAKT_CLIENT_ID': `"${process.env.TRAKT_CLIENT_ID}"`,
    'TRAKT_CLIENT_SECRET': `"${process.env.TRAKT_CLIENT_SECRET}"`,
    /** TODO: remove when auth flow is part of client */
    'TRAKT_BEARER_TOKEN': `"${process.env.TRAKT_BEARER_TOKEN}"`,
  },
  server: {
    fs: {
      allow: [MONOREPO_ROOT],
    },
    proxy: {
      '/api': {
        target: Environment.production,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
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
