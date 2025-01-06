import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { getLanguageAndRegion } from '$lib/features/i18n/index.ts';
import type { MediaType } from '$lib/models/MediaType.ts';
import { showWatchNowQuery } from '$lib/requests/queries/shows/showWatchNowQuery.ts';
import { findFavoriteWatchNowService } from '$lib/stores/_internal/findFavoriteWatchNowService.ts';
import { createQuery, type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived, get, writable } from 'svelte/store';
import type { WatchNowServices } from '../requests/models/WatchNowServices.ts';
import { movieWatchNowQuery } from '../requests/queries/movies/movieWatchNowQuery.ts';

type WatchNowStoreProps = {
  type: MediaType;
  id: string;
};

function typeToQuery(
  type: MediaType,
  slug: string,
  country: string,
): CreateQueryOptions<WatchNowServices> {
  const params = { slug, country };

  switch (type) {
    case 'movie':
      return movieWatchNowQuery(params);
    case 'show':
      return showWatchNowQuery(params);
  }
}

export function useWatchNow({ type, id }: WatchNowStoreProps) {
  const { isAuthorized } = useAuth();
  if (!get(isAuthorized)) {
    return {
      watchNow: writable(undefined),
      isLoading: writable(false),
    };
  }

  const { current } = useUser();
  const { region } = getLanguageAndRegion();

  const { watchNow: watchNowSettings } = current();
  const country = watchNowSettings.country ?? region;

  const watchNow = createQuery({
    ...typeToQuery(type, id, country),
    staleTime: Infinity,
    enabled: watchNowSettings.showOnlyFavorites,
  });

  return {
    watchNow: derived(
      watchNow,
      ($watchNow) =>
        $watchNow.data && findFavoriteWatchNowService({
          services: $watchNow.data,
          favorites: watchNowSettings.favorites ?? [],
        }),
    ),
    isLoading: derived(
      watchNow,
      ($watchNow) => $watchNow.isLoading || $watchNow.isFetching,
    ),
  };
}
