import type { BehaviorSubject } from 'rxjs';
import { fetchSearchKeys } from './fetchSearchKeys.ts';
import { SEARCH_KEY_LIFETIME } from './searchKeyLifetime.ts';

// Refresh coordination shared across every useSearch() instance. useSearch is
// mounted by multiple components and its pipeline can run more than once per
// search, so keeping this state in the hook closure minted a key per run.
// Hoisting it here means a stale key triggers a single re-mint, reused by all
// callers, and the staleness clock is shared.
let activeConfig: BehaviorSubject<TypesenseConfig> | null = null;
let mintedAt = Date.now();
let nextAttemptAt = 0;
let refreshPromise: Promise<TypesenseConfig> | null = null;

export function ensureFreshSearchKeys(
  config: BehaviorSubject<TypesenseConfig>,
): Promise<TypesenseConfig> {
  // A new provider means a freshly minted SSR key: reset the clock to it.
  if (config !== activeConfig) {
    activeConfig = config;
    mintedAt = Date.now();
    nextAttemptAt = 0;
    refreshPromise = null;
  }

  const now = Date.now();
  const isStale = now - mintedAt >= SEARCH_KEY_LIFETIME.refreshInterval;
  if (!isStale || now < nextAttemptAt) {
    return Promise.resolve(config.value);
  }

  // Reuse the in-flight refresh so concurrent searches share one request.
  if (!refreshPromise) {
    refreshPromise = fetchSearchKeys()
      .then((fresh) => {
        config.next(fresh);
        mintedAt = Date.now();
        return fresh;
      })
      .catch(() => {
        // Back off before retrying so a failing endpoint is not hit on every
        // subsequent search. Keep serving the current key meanwhile.
        nextAttemptAt = Date.now() + SEARCH_KEY_LIFETIME.retryCooldown;
        return config.value;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}
