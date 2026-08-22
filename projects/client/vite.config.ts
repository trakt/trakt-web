import { sveltekitOG } from '@ethercorps/sveltekit-og/plugin';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { Environment } from '@trakt/api';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { defineConfig } from 'vite';
import denoSveltekitExit from './.vite/deno-sveltekit-exit.ts';
import { manifest } from './src/lib/pwa/manifest.ts';

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

function getGitCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (error) {
    console.warn('Failed to get git commit hash:', error);
    return 'unknown';
  }
}

const GIT_COMMIT_HASH = getGitCommitHash();

const MONOREPO_ROOT = findGitRoot(import.meta.dirname);

const TRAKT_TARGET_ENVIRONMENT = (() => {
  if (process.env.IS_CONTRIB) {
    return Environment.production;
  }

  if (process.env.IS_STAGING) {
    return Environment.staging;
  }

  return Environment.production_private;
})();

const TRAKT_API_PROXY_TARGET = process.env.IS_LOCAL
  ? 'http://localhost:8787'
  : TRAKT_TARGET_ENVIRONMENT;

const IS_DOCTOR = process.env.IS_DOCTOR === 'true';

export default defineConfig(({ mode }) => ({
  define: {
    'TRAKT_CLIENT_ID': `"${process.env.TRAKT_CLIENT_ID}"`,
    'TRAKT_MODE': `"${mode}${process.env.IS_PREVIEW ? '-preview' : ''}"`,
    'TRAKT_TARGET_ENVIRONMENT': `"${TRAKT_TARGET_ENVIRONMENT}"`,
    'TRAKT_GIT_SHA': `"${GIT_COMMIT_HASH}"`,
  },

  server: {
    fs: {
      allow: [MONOREPO_ROOT],
    },
    proxy: {
      '/api/trakt': {
        target: TRAKT_API_PROXY_TARGET,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/trakt/, ''),
      },
    },
    host: '0.0.0.0',
  },

  plugins: [
    // Sentry source map upload requires SENTRY_AUTH_TOKEN; skipped under
    // IS_DOCTOR so the dep-update loop runs without that secret.
    !IS_DOCTOR && sentrySvelteKit({
      org: 'trakt-tv',
      project: 'trakt-web',
    }),
    sveltekit(),
    sveltekitOG(),
    paraglideVitePlugin({
      project: './i18n/project.inlang',
      outdir: './src/lib/paraglide',
    }),
    denoSveltekitExit(),
    SvelteKitPWA({
      injectRegister: 'script-defer',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.ts',
      manifest,
      manifestFilename: 'manifest.webmanifest',
      injectManifest: {
        injectionPoint: 'self.__WB_MANIFEST',
        /**
         * Precache the app shell only.
         *
         * The plugin default globs every `js,css,ico,png,svg,webp` file under
         * `client/`, which swept in every `_app/immutable/` chunk (~630
         * files) plus `pwa/screenshots` (1.2 MB) and `yir` (1.8 MB). Workbox
         * caches precache entries strictly one at a time
         * (GoogleChrome/workbox#2528), so install spent minutes on serialized
         * requests -- and because precaching runs inside the install event's
         * `waitUntil`, the worker could not activate (and therefore could not
         * serve a single runtime cache) until it finished.
         *
         * Hashed build output does not need precaching: it is immutable by
         * URL, so the `CacheFirst` static-asset route in `service-worker.ts`
         * caches exactly the chunks the visitor actually loads, when they load
         * them.
         */
        globPatterns: [
          'client/*.{svg,ico,webmanifest}',
          'client/pwa/{android,ios,shortcuts}/*.{png,svg}',
          'client/placeholders/*.png',
        ],
        globIgnores: [
          'server/**',
          'client/_app/**',
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
    svelteTesting(),
  ],

  build: {
    sourcemap: !IS_DOCTOR,
    minify: IS_DOCTOR ? false : undefined,
  },

  //TODO enable globals when typings are fixed
  test: {
    include: [
      'src/**/*.{test,spec}.{js,ts}',
      '.scripts/**/*.{test,spec}.{js,ts}',
      'i18n/**/*.{test,spec}.{js,ts}',
    ],
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['clover', 'lcov'],
      exclude: [
        '.svelte-kit/**',
        '.vite/**',
        'e2e/**',
        'test/**',
        'static/**',
        'src/routes/_design_system/**',
        'src/mocks/**',
        'src/lib/paraglide/**',
      ],
    },
    reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : ['dot'],
  },

  resolve: process.env.VITEST
    ? {
      conditions: ['browser'],
    }
    : undefined,
}));
