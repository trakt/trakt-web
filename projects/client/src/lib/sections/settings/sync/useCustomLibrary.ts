import type { UserCollection } from '$lib/features/auth/stores/useCurrentUserCollection.ts';
import { flattenQueryPages } from '$lib/features/query/flattenQueryPages.ts';
import { isQuerySettled } from '$lib/features/query/isQuerySettled.ts';
import { useAllPagesInfiniteQuery } from '$lib/features/query/useQuery.ts';
import { libraryQuery } from '$lib/requests/queries/sync/libraryQuery.ts';
import { useCollectedRefresh } from '$lib/stores/useCollectedRefresh.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import { map, startWith, switchMap } from 'rxjs';

export function useCustomLibrary() {
  const library = useAllPagesInfiniteQuery({
    ...libraryQuery({ availableOn: 'other', limit: 250 }),
    refetchOnMount: 'always',
    // Clearing requires a fresh response, including after an IndexedDB restore.
    persister: undefined,
  });

  return useCollectedRefresh().pipe(
    switchMap(() => library),
    map((query): UserCollection | null => {
      if (!query.isSuccess || query.isFetching || !isQuerySettled(query)) {
        return null;
      }

      const entries = flattenQueryPages(query);
      return {
        movies: new Set(
          entries.flatMap((item) =>
            item.type === 'movie' ? [item.media.id] : []
          ),
        ),
        episodes: new Set(
          entries.flatMap((item) =>
            item.type === 'episode' ? [item.episode.id] : []
          ),
        ),
      };
    }),
    startWith(null),
    multicast(),
  );
}
