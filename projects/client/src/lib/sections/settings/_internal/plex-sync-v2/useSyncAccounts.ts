import { browser } from '$app/environment';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { mediaSyncAccountsQuery } from '$lib/requests/media-sync/mediaSyncAccountsQuery.ts';
import type { MediaSyncAccount } from '$lib/requests/media-sync/models/MediaSyncAccount.ts';
import { map, tap } from 'rxjs';

function preloadAvatars(accounts: MediaSyncAccount[] | undefined) {
  if (!browser) return;

  accounts?.forEach(({ avatarUrl }) => {
    if (avatarUrl) new Image().src = avatarUrl;
  });
}

export function useSyncAccounts(connectionId: number) {
  return useQuery(mediaSyncAccountsQuery({ connectionId })).pipe(
    map(({ data, isError }) => isError ? [] : data),
    tap(preloadAvatars),
  );
}
