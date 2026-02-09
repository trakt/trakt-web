import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { api } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { extractPageMeta } from '../../_internal/extractPageMeta.ts';
import { LibraryItemSchema } from '../../models/LibraryItem.ts';
import { PaginatableSchemaFactory } from '../../models/Paginatable.ts';
import type { LibraryParams } from './_internal/LibraryParams.ts';
import { mapToLibraryItem } from './_internal/mapToLibraryItem.ts';

const mediaLibraryRequest = (
  { fetch, page = 1, limit, availableOn }: LibraryParams,
) =>
  api({ fetch })
    .sync
    .collection
    .media({
      query: {
        extended: 'full,images,available_on',
        page,
        limit,
        available_on: availableOn,
      },
    });

export const libraryQuery = defineInfiniteQuery({
  key: 'libraryQuery',
  invalidations: [],
  dependencies: (params) => [params.page, params.limit, params.availableOn],
  request: mediaLibraryRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToLibraryItem),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(LibraryItemSchema),
  ttl: time.hours(3),
  refetchOnWindowFocus: true,
});
