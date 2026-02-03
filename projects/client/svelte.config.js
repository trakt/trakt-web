import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';

import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess({
    style: {
      resolve: {
        alias: {
          $style: join(__dirname, 'src/style'),
        },
      },
    },
  }),

  kit: {
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter({
      // See below for an explanation of these options
      routes: {
        include: ['/*'],
        exclude: ['<all>'],
      },
      platformProxy: {
        configPath: 'wrangler.jsonc',
        environment: undefined,
        experimentalJsonConfig: false,
        persist: false,
      },
    }),
    alias: {
      '$mocks': './src/mocks',
      '$worker': './src/worker',
      '$test': './test',
      '$style': 'src/style',
      '$e2e': './e2e',
      '$types': './.svelte-kit/types/src/routes',
    },
  },
};

export default config;
