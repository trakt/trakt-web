import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { getLanguageAndRegion } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived, get, readable } from 'svelte/store';
import type { StreamingServiceOptions } from '../requests/models/StreamingServiceOptions.ts';
import { streamEpisodeQuery } from '../requests/queries/episode/streamEpisodeQuery.ts';
import { streamMovieQuery } from '../requests/queries/movies/streamMovieQuery.ts';
import { streamShowQuery } from '../requests/queries/shows/streamShowQuery.ts';
import { findFavoriteStreamingService } from './_internal/findFavoriteStreamingService.ts';

type StreamOnProps = {
  type: MediaType | 'episode';
  id: number;
};

function typeToQuery(
  type: StreamOnProps['type'],
  id: number,
  country: string,
) {
  const params = { id, country };

  switch (type) {
    case 'movie':
      return streamMovieQuery(params);
    case 'show':
      return streamShowQuery(params);
    case 'episode':
      return streamEpisodeQuery(params);
  }
}

function findViablePreferredService(services: StreamingServiceOptions) {
  // TODO we'll need to revisit and come up with a better heuristic
  return services.streaming.at(0);
}

export function useStreamOn({ type, id }: StreamOnProps) {
  const { isAuthorized } = useAuth();

  if (!get(isAuthorized)) {
    return {
      services: undefined,
      isLoading: readable(false),
    };
  }

  const { current } = useUser();
  const { region } = getLanguageAndRegion();

  const { services } = current();
  const country = services.country ?? region;

  const streamOn = useQuery(typeToQuery(type, id, country));

  return {
    streamOn: derived(
      streamOn,
      ($streamOn) => {
        if (!$streamOn.data) {
          return;
        }

        return {
          services: {
            ...$streamOn.data,
          },
          preferred: findFavoriteStreamingService({
            services: $streamOn.data,
            favorites: services.favorites ?? [],
            countryCode: country,
          }) ?? findViablePreferredService($streamOn.data),
        };
      },
    ),
    isLoading: derived(
      streamOn,
      toLoadingState,
    ),
  };
}
