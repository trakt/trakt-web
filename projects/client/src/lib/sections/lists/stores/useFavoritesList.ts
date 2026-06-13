import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import { createBulkIntlOverlay } from '$lib/features/intl-overlay/createBulkIntlOverlay.ts';
import { makeTargets } from '$lib/features/intl-overlay/makeTargets.ts';
import { withOverlayLoading } from '$lib/features/intl-overlay/withOverlayLoading.ts';
import type { FavoritedEntry } from '$lib/requests/models/FavoritedEntry.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { mediaFavoritesQuery } from '$lib/requests/queries/media/mediaFavoritesQuery.ts';
import { movieFavoritesQuery } from '$lib/requests/queries/movies/movieFavoritesQuery.ts';
import { showFavoritesQuery } from '$lib/requests/queries/shows/showFavoritesQuery.ts';
import type { SortBy } from '$lib/sections/lists/user/models/SortBy.ts';
import type { SortDirection } from '$lib/sections/lists/user/models/SortDirection.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { usePaginatedListQuery } from './usePaginatedListQuery.ts';

export type UseFavoritesProps = {
  type?: DiscoverMode;
  slug: string;
  limit?: number;
  sortBy?: SortBy;
  sortHow?: SortDirection;
} & FilterParams;

function typeToQuery(
  { type, slug, filter, limit, sortBy, sortHow }: UseFavoritesProps & {
    limit: number;
  },
) {
  const params = { slug, filter, limit, sortBy, sortHow };

  switch (type) {
    case 'movie':
      return movieFavoritesQuery(params);
    case 'show':
      return showFavoritesQuery(params);
    default:
      return mediaFavoritesQuery(params);
  }
}

const favoritedEntryTargets = makeTargets<FavoritedEntry>({
  get: (entry) => ({ id: entry.item.id, type: entry.item.type }),
  patch: (entry, title) => ({
    ...entry,
    item: { ...entry.item, title } as typeof entry.item,
  }),
});

export function useFavoritesList(
  { type, slug, filter, limit = DEFAULT_PAGE_SIZE, sortBy, sortHow }:
    UseFavoritesProps,
) {
  const { list: baseList, isLoading: baseLoading, ...rest } =
    usePaginatedListQuery(
      typeToQuery({ type, slug, filter, limit, sortBy, sortHow }),
    );
  const overlay = createBulkIntlOverlay<FavoritedEntry>({
    getTargets: favoritedEntryTargets,
  });
  return {
    list: baseList.pipe(overlay.operator),
    isLoading: withOverlayLoading(baseLoading, overlay.intlLoading$),
    ...rest,
  };
}
