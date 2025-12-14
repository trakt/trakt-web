import { useQuery } from '$lib/features/query/useQuery.ts';
import { hiddenShowsQuery } from '$lib/requests/queries/users/hiddenShowsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';

export const useHiddenShows = () => {
  const query = useQuery(hiddenShowsQuery());

  return {
    list: query.pipe(
      map(($query) => ($query.data ?? []).map((entry) => entry.show.id)),
    ),
    isLoading: query.pipe(map(toLoadingState)),
  };
};
