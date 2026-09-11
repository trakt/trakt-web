import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { GifEntrySchema } from '$lib/requests/models/GifEntry.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import { klipyGifsRequest } from './_internal/klipyGifsRequest.ts';
import { toGifPage } from './_internal/toGifPage.ts';

type GifTrendingParams = { customerId: string } & PaginationParams & ApiParams;

export const gifTrendingQuery = defineInfiniteQuery({
  key: 'gifTrending',
  invalidations: [],
  // `customerId` only personalises ranking; keying on it would give every
  // device its own cache entry for the same list.
  dependencies: (params: GifTrendingParams) => [params.page, params.limit],
  request: ({ fetch, page = 1, limit, customerId }: GifTrendingParams) =>
    klipyGifsRequest({
      path: 'gifs/trending',
      page,
      limit,
      customerId,
      fetch,
    }),
  mapper: (response, params) =>
    toGifPage({ body: response.body, page: params.page ?? 1 }),
  schema: PaginatableSchemaFactory(GifEntrySchema),
  ttl: time.minutes(30),
});
