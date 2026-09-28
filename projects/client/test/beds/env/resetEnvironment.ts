import { setLocale } from '$lib/features/i18n/index.ts';
import { vi } from 'vitest';

const INITIAL_URL = globalThis.location.href;

export function resetEnvironment() {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();

  globalThis.history.replaceState(null, '', INITIAL_URL);
  globalThis.localStorage.clear();
  globalThis.sessionStorage.clear();
  setLocale('en');

  document.head.innerHTML = '';
  document.body.innerHTML = '';
}
