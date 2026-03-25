import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { WatchedProgressEntrySchema } from '$lib/requests/models/WatchedProgressEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import {
  mapToWatchedProgressEntry,
  type WatchedProgressRawItem,
} from './_internal/mapToWatchedProgressEntry.ts';

type WatchedProgressParams = PaginationParams & ApiParams;

type WatchedProgressResponse = {
  body: WatchedProgressRawItem[];
  headers: Headers;
  status: number;
};

const watchedProgressRequest = async (
  { fetch, page = 1, limit = 10 }: WatchedProgressParams,
): Promise<WatchedProgressResponse> => {
  const query = new URLSearchParams({
    include_seasons: 'true',
    extended: 'full,images',
    page: String(page),
    limit: String(limit),
  });

  const response = await rawApiFetch({
    fetch,
    path: `/sync/progress/watched?${query}`,
    init: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });

  const body = response.ok
    ? await response.json() as WatchedProgressRawItem[]
    : [] as WatchedProgressRawItem[];

  return {
    body,
    headers: response.headers,
    status: response.status,
  };
};

export const watchedProgressQuery = defineInfiniteQuery({
  key: 'watchedProgress',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Drop('show'),
    InvalidateAction.Restore,
  ],
  dependencies: (params: WatchedProgressParams) => [
    params.page,
    params.limit,
  ],
  request: watchedProgressRequest,
  mapper: (queryResponse) => {
    const response = queryResponse as WatchedProgressResponse;

    return {
      entries: response.body.map(mapToWatchedProgressEntry),
      page: extractPageMeta(response.headers),
    };
  },
  schema: PaginatableSchemaFactory(WatchedProgressEntrySchema),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
