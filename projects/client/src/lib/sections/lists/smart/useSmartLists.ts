import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import { smartListQuery } from '$lib/requests/queries/users/smartListQuery.ts';
import { DEFAULT_SMART_LIST_LIMIT } from '$lib/utils/constants.ts';
import { combineLatest, map } from 'rxjs';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';

type UseSmartListsProps = {
  mode: DiscoverMode;
  limit?: number;
};

export function typeToQuery(type: DiscoverMode, limit: number) {
  if (type === 'movie') return [smartListQuery({ type: 'movie', limit })];
  if (type === 'show') return [smartListQuery({ type: 'show', limit })];
  return [
    smartListQuery({ type: 'movie', limit }),
    smartListQuery({ type: 'show', limit }),
  ];
}

export function useSmartLists({ mode, limit }: UseSmartListsProps) {
  const effectiveLimit = limit ?? DEFAULT_SMART_LIST_LIMIT;

  const results = typeToQuery(mode, effectiveLimit).map(usePaginatedListQuery);

  const list = combineLatest(results.map(({ list }) => list)).pipe(
    map((lists) =>
      lists.flat()
        .toSorted((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, effectiveLimit)
    ),
  );

  const isLoading = combineLatest(results.map(({ isLoading }) => isLoading))
    .pipe(
      map((loadings) => loadings.some(Boolean)),
    );

  return { list, isLoading };
}
