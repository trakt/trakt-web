import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { Environment } from '@trakt/api';
import { defineConfig } from 'vitest/config';
import denoSveltekitExit from './.vite/deno-sveltekit-exit.ts';

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
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

function getGitCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (error) {
    console.warn('Failed to get git commit hash:', error);
    return 'unknown';
  }
}

const GIT_COMMIT_HASH = getGitCommitHash();

const MONOREPO_ROOT = findGitRoot(__dirname);

const TRAKT_TARGET_ENVIRONMENT = (() => {
  if (process.env.IS_CONTRIB) {
    return Environment.production;
  }

  if (process.env.IS_STAGING) {
    return Environment.staging;
  }

  return Environment.production_private;
})();

export default defineConfig(({ mode }) => ({
  define: {
    'TRAKT_CLIENT_ID': `"${process.env.TRAKT_CLIENT_ID}"`,
    'TRAKT_MODE': `"${mode}${process.env.IS_PREVIEW ? '-preview' : ''}"`,
    'TRAKT_TARGET_ENVIRONMENT': `"${TRAKT_TARGET_ENVIRONMENT}"`,
    'FIREBASE_PROJECT_ID': `"${process.env.FIREBASE_PROJECT_ID}"`,
    'FIREBASE_API_KEY': `"${process.env.FIREBASE_API_KEY}"`,
    'FIREBASE_APP_ID': `"${process.env.FIREBASE_APP_ID}"`,
    'FIREBASE_MEASUREMENT_ID': `"${process.env.FIREBASE_MEASUREMENT_ID}"`,
    'FIREBASE_MESSAGING_SENDER_ID':
      `"${process.env.FIREBASE_MESSAGING_SENDER_ID}"`,
    'TRAKT_GIT_SHA': `"${GIT_COMMIT_HASH}"`,
  },

  server: {
    fs: {
      allow: [MONOREPO_ROOT],
    },
    proxy: {
      '/api/trakt': {
        target: TRAKT_TARGET_ENVIRONMENT,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/trakt/, ''),
      },
    },
    host: '0.0.0.0',
  },

  plugins: [
    // sentrySvelteKit({
    //   sourceMapsUploadOptions: {
    //     org: 'trakt-tv',
    //     project: 'trakt-web',
    //   },
    //   telemetry: false,
    // }),
    sveltekit(),
    paraglideVitePlugin({
      project: './i18n/project.inlang',
      outdir: './src/lib/paraglide',
    }),
    denoSveltekitExit(),
    // SvelteKitPWA({
    //   injectRegister: 'script-defer',
    //   strategies: 'injectManifest',
    //   srcDir: 'src',
    //   filename: 'service-worker.ts',
    //   manifest,
    //   manifestFilename: 'manifest.webmanifest',
    //   injectManifest: {
    //     injectionPoint: 'self.__WB_MANIFEST',
    //   },
    //   devOptions: {
    //     enabled: true,
    //   },
    // }),
    svelteTesting(),
  ],

  build: {
    sourcemap: true,
    rollupOptions: {
      treeshake: {
        // Tells Rollup not to deeply traverse complex objects/schemas looking for side-effect getters
        propertyReadSideEffects: false,
        // Optional: speeds up traversal by assuming try/catch blocks don't contain hidden side-effects
        tryCatchDeoptimization: false,
      },
    },
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

  resolve: {
    alias: [
      {
        // 1. Intercepts Sass trying to resolve $style as a relative folder
        find: /.*\$style\/(.*)/,
        replacement: path.resolve(__dirname, './src/style/$1'),
      },
      {
        // 2. Standard alias for normal JS/TS imports
        find: '$style',
        replacement: path.resolve(__dirname, './src/style'),
      },
    ],
    conditions: process.env.VITEST ? ['browser'] : undefined,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        loadPaths: [path.resolve(__dirname, './src/style')],
      },
    },
  },
}));
