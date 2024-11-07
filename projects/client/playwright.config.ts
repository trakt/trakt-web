import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'deno run build && deno run preview',
    port: 4173,
  },

  testDir: 'e2e',
});
