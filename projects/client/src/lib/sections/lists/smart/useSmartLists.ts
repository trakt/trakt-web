import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { smartListQuery } from '$lib/requests/queries/users/smartListQuery.ts';
import { DEFAULT_SMART_LIST_LIMIT } from '$lib/utils/constants.ts';
import { map } from 'rxjs';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';
import { matchesDiscoverMode } from './matchesDiscoverMode.ts';

type UseSmartListsProps = {
  mode: DiscoverMode;
  limit?: number;
};

export function useSmartLists({ mode, limit }: UseSmartListsProps) {
  const effectiveLimit = limit ?? DEFAULT_SMART_LIST_LIMIT;

  const { list: baseList, isLoading } = usePaginatedListQuery(
    smartListQuery({}),
  );

  const list = baseList.pipe(
    map((lists) =>
      lists
        .filter((entry) =>
          matchesDiscoverMode({ mediaType: entry.mediaType, mode }),
        )
        .toSorted((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, effectiveLimit),
    ),
  );

  return { list, isLoading };
}
