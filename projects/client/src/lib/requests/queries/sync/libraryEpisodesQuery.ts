import { api } from '$lib/requests/api.ts';
import { defineInfiniteQuery } from '../../../features/query/defineQuery.ts';
import { time } from '../../../utils/timing/time.ts';
import { extractPageMeta } from '../../_internal/extractPageMeta.ts';
import { LibraryItemSchema } from '../../models/LibraryItem.ts';
import { PaginatableSchemaFactory } from '../../models/Paginatable.ts';
import { type LibraryParams } from './_internal/LibraryParams.ts';
import { mapToLibraryItem } from './_internal/mapToLibraryItem.ts';

export const episodeLibraryRequest = (
  { fetch, page = 1, limit, availableOn }: LibraryParams,
) =>
  api({ fetch })
    .sync
    .collection
    .episodes({
      query: {
        extended: 'full,images,available_on',
        page,
        limit,
        available_on: availableOn,
      },
    });

export const libraryEpisodesQuery = defineInfiniteQuery({
  key: 'libraryEpisodesQuery',
  invalidations: [],
  dependencies: (params) => [params.page, params.limit, params.availableOn],
  request: episodeLibraryRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToLibraryItem),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(LibraryItemSchema),
  ttl: time.hours(3),
  refetchOnWindowFocus: true,
});
