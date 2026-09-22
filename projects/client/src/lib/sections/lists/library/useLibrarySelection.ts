import { useToggler } from '$lib/components/toggles/useToggler.ts';
import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
import { libraryQuery } from '$lib/requests/queries/sync/libraryQuery.ts';
import { useCollectedRefresh } from '$lib/stores/useCollectedRefresh.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import {
  combineLatest,
  map,
  type Observable,
  startWith,
  switchMap,
} from 'rxjs';
import type { Library } from './models/Library.ts';

export function useLibrarySelection(value?: Observable<Library>) {
  const { current, options, set } = useToggler('library');
  const query = useInfiniteQuery({
    ...libraryQuery({ availableOn: 'other', page: 1, limit: 1 }),
    refetchOnMount: 'always',
    persister: undefined,
  });
  const customLibrary = useCollectedRefresh({ refetchType: 'none' }).pipe(
    switchMap(() => query),
    startWith(null),
    multicast(),
  );

  const selection = combineLatest([
    value ?? current.pipe(map((option) => option.value)),
    customLibrary,
  ]).pipe(
    map(([requested, query]) => {
      const isLoading = !query || query.isPending || query.isFetching;
      const hasCustomLibrary = !isLoading && query?.isSuccess &&
        query.data.pages.some((page) => page.entries.length > 0);
      const isEmpty = !isLoading && query?.isSuccess && !hasCustomLibrary;
      const available = options.filter((option) =>
        option.value !== 'other' || hasCustomLibrary
      );
      const active = requested === 'other' && isEmpty ? 'plex' : requested;

      return { value: active, options: available, isLoading };
    }),
  );

  return { selection, set };
}
