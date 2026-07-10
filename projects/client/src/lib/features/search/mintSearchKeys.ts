import { createSearcher } from '$lib/requests/search/createSearcher.ts';
import { DEFAULT_SEARCH_LIMIT } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import { SEARCH_KEY_LIFETIME } from './searchKeyLifetime.ts';

// Hard caps baked into the scoped key. Typesense applies embedded params
// itself and the client cannot override them, so these enforce a per-search
// compute ceiling even if the transient token is replayed directly.
const SEARCH_CUTOFF_MS = 250; // tune toward 100-150 once p99 search latency is confirmed

type MintSearchKeysParams = {
  key: string;
  server: string;
};

export function mintSearchKeys(
  { key, server }: MintSearchKeysParams,
): TypesenseConfig {
  const typesense = createSearcher({ key, server });
  const expires_at = Math.floor(
    (Date.now() + SEARCH_KEY_LIFETIME.ttl) / time.seconds(1),
  );

  const scope = (preset: string) =>
    typesense
      .keys()
      .generateScopedSearchKey(key, {
        preset,
        limit_hits: DEFAULT_SEARCH_LIMIT,
        per_page: DEFAULT_SEARCH_LIMIT,
        search_cutoff_ms: SEARCH_CUTOFF_MS,
        expires_at,
      });

  return {
    keys: {
      media: {
        default: scope('search:media'),
        exact: scope('search:media:exact'),
      },
      people: scope('search:people'),
    },
    server,
  };
}
