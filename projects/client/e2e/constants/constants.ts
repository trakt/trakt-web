import process from 'node:process';

export const E2E_HEADLESS = process.env.E2E_HEADLESS === 'true';
export const E2E_BASE_URL = process.env.E2E_BASE_URL ??
  'http://localhost:5173/';
