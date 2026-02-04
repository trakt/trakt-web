import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import { userMovieListIdsQuery } from '$lib/requests/queries/users/userMovieListIdsQuery.ts';
import { userShowListIdsQuery } from '$lib/requests/queries/users/userShowListIdsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';

type UseListIdsProps = { media: MediaEntry };

function typeToQuery(media: MediaEntry) {
  const params = { slug: media.slug };

  switch (media.type) {
    case 'movie':
      return userMovieListIdsQuery(params);
    case 'show':
      return userShowListIdsQuery(params);
  }
}

export function useListedOnIds({ media }: UseListIdsProps) {
  const response = useQuery(typeToQuery(media));

  return {
    listedOnIds: response.pipe(map(($response) => $response.data ?? [])),
    isLoading: response.pipe(map(toLoadingState)),
  };
}
