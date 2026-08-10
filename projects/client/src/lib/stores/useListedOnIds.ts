import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import { userMovieListIdsQuery } from '$lib/requests/queries/users/userMovieListIdsQuery.ts';
import { userShowListIdsQuery } from '$lib/requests/queries/users/userShowListIdsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map, type Observable } from 'rxjs';

type UseListIdsProps = { media$: Observable<MediaEntry> };

function typeToQuery(media: MediaEntry) {
  const params = { slug: media.slug };

  switch (media.type) {
    case 'movie':
      return userMovieListIdsQuery(params);
    case 'show':
      return userShowListIdsQuery(params);
  }
}

export function useListedOnIds({ media$ }: UseListIdsProps) {
  const response = useQuery(media$.pipe(map(typeToQuery)));

  return {
    listedOnIds: response.pipe(map(($response) => $response.data ?? [])),
    isLoading: response.pipe(map(toLoadingState)),
  };
}
