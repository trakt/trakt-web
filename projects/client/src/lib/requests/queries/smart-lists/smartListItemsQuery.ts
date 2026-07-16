import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { MovieResponse, ShowResponse } from '@trakt/api';
import { z } from 'zod';

// @trakt/api does not re-export SmartListItemResponse from its root, so mirror
// the response shape here.
export type SmartListItemResponse = {
  rank: number;
  type: string;
  movie?: MovieResponse | null;
  show?: ShowResponse | null;
};

type SmartListItemsParams =
  & {
    slug: string;
    type?: string;
    sortBy?: string;
    sortHow?: 'asc' | 'desc';
  }
  & PaginationParams
  & ApiParams
  & FilterParams;

const SmartListItemSchema = z.union([ShowEntrySchema, MovieEntrySchema]);

function mapToSmartListItem(item: SmartListItemResponse) {
  if (item.type === 'show') {
    return mapToShowEntry(
      assertDefined(item.show, 'Expected show in SmartListItemResponse'),
    );
  }

  return mapToMovieEntry(
    assertDefined(item.movie, 'Expected movie in SmartListItemResponse'),
  );
}

const smartListItemsRequest = (
  { fetch, slug, limit, page, filter, type, sortBy, sortHow }:
    SmartListItemsParams,
) =>
  api({ fetch })
    .smart_lists
    .items({
      params: {
        list_id: slug,
        type: type ?? 'all',
        sort_by: sortBy ?? 'rank',
        sort_how: sortHow ?? 'asc',
      },
      query: {
        extended: 'full,images,colors',
        page,
        limit,
        ...filter,
      },
    });

export const smartListItemsQuery = defineInfiniteQuery({
  key: 'smartListItems',
  invalidations: [],
  dependencies: (
    params: SmartListItemsParams,
  ) => [
    params.slug,
    params.limit,
    params.page,
    params.type,
    params.sortBy,
    params.sortHow,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: smartListItemsRequest,
  mapper: (response) => ({
    // @trakt/api 0.4.27 mis-types items as double-nested (`movie.movie`); the
    // live endpoint returns them flat, so re-cast to the real shape.
    entries: (response.body as unknown as SmartListItemResponse[])
      .map(mapToSmartListItem),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(SmartListItemSchema),
  ttl: time.minutes(30),
});
