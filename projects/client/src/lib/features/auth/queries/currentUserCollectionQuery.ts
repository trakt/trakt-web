import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { CollectionMinimalResponse } from '@trakt/api';
import { z } from 'zod';
import { toCollectionTraktIds } from './_internal/toCollectionTraktIds.ts';

type CurrentUserCollectionParams =
  & {
    type: 'movies' | 'episodes';
  }
  & PaginationParams
  & ApiParams;

// FIXME: use api().sync.collection.minimal[type] once @trakt/api types page & limit
const currentUserCollectionRequest = async (
  { fetch, type, page = 1, limit }: CurrentUserCollectionParams,
) => {
  const query = new URLSearchParams({
    page: `${page}`,
    limit: `${limit}`,
  });

  const response = await rawApiFetch({
    fetch,
    path: `/sync/collection/minimal/${type}?${query}`,
  });

  const body: CollectionMinimalResponse = response.ok
    ? await response.json()
    : {};

  return { body, headers: response.headers, status: response.status };
};

export const currentUserCollectionQuery = defineInfiniteQuery({
  key: 'currentUserCollection',
  request: currentUserCollectionRequest,
  invalidations: [
    InvalidateAction.Collected('movie'),
    InvalidateAction.Collected('episode'),
  ],
  dependencies: (params) => [params.type, params.limit],
  mapper: (response, { page = 1 }) => ({
    entries: toCollectionTraktIds(response.body),
    page: extractPageMeta(response.headers, page),
  }),
  schema: PaginatableSchemaFactory(z.number()),
  ttl: time.hours(3),
});
