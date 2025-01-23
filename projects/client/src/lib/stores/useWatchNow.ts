import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { getLanguageAndRegion } from '$lib/features/i18n/index.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { WatchNowServices } from '$lib/requests/models/WatchNowServices.ts';
import { episodeWatchNowQuery } from '$lib/requests/queries/episode/episodeWatchNowQuery.ts';
import { showWatchNowQuery } from '$lib/requests/queries/shows/showWatchNowQuery.ts';
import { findFavoriteWatchNowService } from '$lib/stores/_internal/findFavoriteWatchNowService.ts';
import { time } from '$lib/utils/timing/time.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';
import { movieWatchNowQuery } from '../requests/queries/movies/movieWatchNowQuery.ts';

type WatchNowMediaType = MediaType | 'episode';

type WatchNowStoreProps = {
  type: WatchNowMediaType;
  id: number;
};

function typeToQuery(
  type: WatchNowMediaType,
  id: number,
  country: string,
) {
  const params = { id, country };

  switch (type) {
    case 'movie':
      return movieWatchNowQuery(params);
    case 'show':
      return showWatchNowQuery(params);
    case 'episode':
      return episodeWatchNowQuery(params);
  }
}

function findViablePreferredService(services: WatchNowServices) {
  // TODO we'll need to revisit and come up with a better heuristic
  return services.streaming.at(0);
}

export function useWatchNow({ type, id }: WatchNowStoreProps) {
  const { current } = useUser();
  const { region } = getLanguageAndRegion();

  const { watchNow: watchNowSettings } = current();
  const country = watchNowSettings.country ?? region;

  const watchNow = createQuery({
    ...typeToQuery(type, id, country),
    staleTime: time.days(1),
  });

  return {
    watchNow: derived(
      watchNow,
      ($watchNow) => {
        if (!$watchNow.data) {
          return;
        }

        return {
          services: {
            ...$watchNow.data,
          },
          preferred: findFavoriteWatchNowService({
            services: $watchNow.data,
            favorites: watchNowSettings.favorites ?? [],
            countryCode: country,
          }) ?? findViablePreferredService($watchNow.data),
        };
      },
    ),
    isLoading: derived(
      watchNow,
      ($watchNow) => $watchNow.isLoading || $watchNow.isFetching,
    ),
  };
}
