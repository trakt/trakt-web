import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import {
  type SmartList,
  smartListQuery,
} from '$lib/requests/queries/users/smartListQuery.ts';
import { DEFAULT_SMART_LIST_LIMIT } from '$lib/utils/constants.ts';
import { map } from 'rxjs';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';

type UseSmartListsProps = {
  mode: DiscoverMode;
  limit?: number;
};

function matchesMode(list: SmartList, mode: DiscoverMode): boolean {
  if (mode === 'media') {
    return true;
  }

  if (mode === 'movie') {
    return list.mediaType === 'movies';
  }

  return list.mediaType === 'shows';
}

export function useSmartLists({ mode, limit }: UseSmartListsProps) {
  const effectiveLimit = limit ?? DEFAULT_SMART_LIST_LIMIT;

  const { list: baseList, isLoading } = usePaginatedListQuery(
    smartListQuery({}),
  );

  const matching = baseList.pipe(
    map((lists) =>
      lists
        .filter((entry) => matchesMode(entry, mode))
        .toSorted((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    ),
  );

  const list = matching.pipe(
    map((lists) => lists.slice(0, effectiveLimit)),
  );

  // Total matching smart lists, uncapped by `limit`, for the lists-page count.
  const count = matching.pipe(map((lists) => lists.length));

  return { list, isLoading, count };
}
