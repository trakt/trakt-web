import { hiddenShowsQuery } from '$lib/requests/queries/users/hiddenShowsQuery.ts';
import { derived } from 'svelte/store';
import { usePaginatedListQuery } from '../../stores/usePaginatedListQuery.ts';

export const useHiddenShows = () => {
  const { list, isLoading } = usePaginatedListQuery(hiddenShowsQuery());

  return {
    list: derived(
      list,
      ($list) => $list.map((entry) => entry.show.id),
    ),
    isLoading,
  };
};
