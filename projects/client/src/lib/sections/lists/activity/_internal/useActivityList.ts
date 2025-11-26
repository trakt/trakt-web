import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { socialActivityQuery } from '$lib/requests/queries/users/socialActivityQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { derived } from 'svelte/store';

type ActivityListProps =
  & {
    type: DiscoverMode;
  }
  & PaginationParams
  & FilterParams;

export function useActivityList(props: ActivityListProps) {
  const { list, page, isLoading } = usePaginatedListQuery(
    socialActivityQuery(props),
  );

  return {
    list: derived(list, ($list) => {
      if (!props.type || props.type === 'media') {
        return $list;
      }

      return $list.filter((entry) =>
        entry.type === props.type ||
        props.type === 'show' && entry.type === 'episode'
      );
    }),
    page,
    isLoading,
  };
}
