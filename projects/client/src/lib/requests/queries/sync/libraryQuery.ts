import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { api } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { extractPageMeta } from '../../_internal/extractPageMeta.ts';
import { LibraryItemSchema } from '../../models/LibraryItem.ts';
import { PaginatableSchemaFactory } from '../../models/Paginatable.ts';
import type { LibraryParams } from './_internal/LibraryParams.ts';
import { mapToLibraryItem } from './_internal/mapToLibraryItem.ts';

const mapToEndpoint = (type?: DiscoverMode) => {
  switch (type) {
    case 'movie':
      return 'movies';
    case 'show':
      return 'episodes';
    default:
      return 'media';
  }
};

const mediaLibraryRequest = (
  { fetch, page = 1, limit, availableOn, type }: LibraryParams,
) => {
  const endpoint = mapToEndpoint(type);

  return api({ fetch })
    .sync
    .collection[endpoint]({
      query: {
        extended: 'full,images,available_on',
        page,
        limit,
        available_on: availableOn,
      },
    });
};

export const libraryQuery = defineInfiniteQuery({
  key: 'libraryQuery',
  invalidations: [],
  dependencies: (
    params,
  ) => [params.page, params.limit, params.availableOn, params.type],
  request: mediaLibraryRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToLibraryItem),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(LibraryItemSchema),
  ttl: time.hours(3),
  refetchOnWindowFocus: true,
});
