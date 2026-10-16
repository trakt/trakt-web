import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { hiddenShowsQuery } from '$lib/requests/queries/users/hiddenShowsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import type { QueryClient } from '@tanstack/query-core';
import { distinctUntilChanged, map, type Observable, shareReplay } from 'rxjs';

type HiddenShows = {
  ids: Observable<ReadonlySet<number>>;
  isLoading: Observable<boolean>;
};

const hiddenShowsByClient = new WeakMap<QueryClient, HiddenShows>();

export const useHiddenShows = (): HiddenShows => {
  const client = useQueryClient();
  const existing = hiddenShowsByClient.get(client);
  if (existing) return existing;

  const query = useQuery(hiddenShowsQuery());

  const hiddenShows: HiddenShows = {
    ids: query.pipe(
      map(($query) => $query.data),
      distinctUntilChanged(),
      map((data) => new Set((data ?? []).map((entry) => entry.show.id))),
      shareReplay({ bufferSize: 1, refCount: true }),
    ),
    isLoading: query.pipe(map(toLoadingState)),
  };

  hiddenShowsByClient.set(client, hiddenShows);
  return hiddenShows;
};
