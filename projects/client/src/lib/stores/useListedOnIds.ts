import { useQuery } from '$lib/features/query/useQuery.ts';
import type { ListTarget } from '$lib/models/ListTarget.ts';
import { userEpisodeListIdsQuery } from '$lib/requests/queries/users/userEpisodeListIdsQuery.ts';
import { userMovieListIdsQuery } from '$lib/requests/queries/users/userMovieListIdsQuery.ts';
import { userSeasonListIdsQuery } from '$lib/requests/queries/users/userSeasonListIdsQuery.ts';
import { userShowListIdsQuery } from '$lib/requests/queries/users/userShowListIdsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map, type Observable } from 'rxjs';

type UseListIdsProps = { target$: Observable<ListTarget> };

function targetToQuery(target: ListTarget) {
  switch (target.type) {
    case 'movie':
      return userMovieListIdsQuery({ slug: target.media.slug });
    case 'show':
      return userShowListIdsQuery({ slug: target.media.slug });
    case 'season':
      return userSeasonListIdsQuery({ id: target.media.id });
    case 'episode':
      return userEpisodeListIdsQuery({ id: target.media.id });
  }
}

export function useListedOnIds({ target$ }: UseListIdsProps) {
  const response = useQuery(target$.pipe(map(targetToQuery)));

  return {
    listedOnIds: response.pipe(map(($response) => $response.data ?? [])),
    isLoading: response.pipe(map(toLoadingState)),
  };
}
