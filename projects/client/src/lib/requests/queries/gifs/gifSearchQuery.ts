import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { GifEntrySchema } from '$lib/requests/models/GifEntry.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import { klipyGifsRequest } from './_internal/klipyGifsRequest.ts';
import { toGifPage } from './_internal/toGifPage.ts';

type GifSearchParams =
  & { query: string; customerId: string }
  & PaginationParams
  & ApiParams;

export const gifSearchQuery = defineInfiniteQuery({
  key: 'gifSearch',
  invalidations: [],
  dependencies: (params: GifSearchParams) => [
    params.query,
    params.page,
    params.limit,
  ],
  request: ({ fetch, query, page = 1, limit, customerId }: GifSearchParams) =>
    klipyGifsRequest({
      path: 'gifs/search',
      query,
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
