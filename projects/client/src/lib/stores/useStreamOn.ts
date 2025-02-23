import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { getLanguageAndRegion } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { StreamingServiceOptions } from '$lib/requests/models/StreamingServiceOptions.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived, get, readable } from 'svelte/store';
import { streamEpisodeQuery } from '../requests/queries/episode/streamEpisodeQuery.ts';
import { streamMovieQuery } from '../requests/queries/movies/streamMovieQuery.ts';
import { streamShowQuery } from '../requests/queries/shows/streamShowQuery.ts';
import { findFavoriteStreamingService } from './_internal/findFavoriteStreamingService.ts';

type EpisodeStreamOnProps = {
  type: 'episode';
  id: string;
  season: number;
  episode: number;
};

type MediaStreamOnProps = {
  type: MediaType;
  id: string;
};

type StreamOnProps = EpisodeStreamOnProps | MediaStreamOnProps;

function typeToQuery(
  props: StreamOnProps,
  country: string,
) {
  const commonParams = { country };

  switch (props.type) {
    case 'movie':
      return streamMovieQuery({
        id: props.id,
        ...commonParams,
      });
    case 'show':
      return streamShowQuery({
        id: props.id,
        ...commonParams,
      });
    case 'episode':
      return streamEpisodeQuery({
        id: props.id,
        season: props.season,
        episode: props.episode,
        ...commonParams,
      });
  }
}

function findViablePreferredService(services: StreamingServiceOptions) {
  // TODO we'll need to revisit and come up with a better heuristic
  return services.streaming.at(0);
}

export function useStreamOn(props: StreamOnProps) {
  const { isAuthorized } = useAuth();

  if (!get(isAuthorized)) {
    return {
      streamOn: readable(undefined),
      isLoading: readable(false),
    };
  }

  const { current } = useUser();
  const { region } = getLanguageAndRegion();

  const { services } = current();
  const country = services.country ?? region;

  const streamOn = useQuery(typeToQuery(props, country));

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
