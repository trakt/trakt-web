import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { mapToShowProgress } from '$lib/requests/_internal/mapToShowProgress.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import {
  type WatchedProgressEntry,
  WatchedProgressEntrySchema,
} from '$lib/requests/models/ProgressEntry.ts';
import type { SortBy } from '$lib/sections/lists/user/models/SortBy.ts';
import type {
  SortDirection,
} from '$lib/sections/lists/user/models/SortDirection.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { UpNextResponse } from '@trakt/api';

type ProgressWatchedParams =
  & {
    intent: 'continue' | 'completed';
    sortBy?: SortBy;
    sortHow?: SortDirection;
  }
  & PaginationParams
  & ApiParams;

function mapToWatchedProgressEntry(
  item: UpNextResponse,
): WatchedProgressEntry {
  const show = mapToShowEntry(item.show);

  return {
    key: show.key,
    type: 'watched',
    show,
    ...mapToShowProgress(item.progress),
  };
}

function mapToNitroSortBy(sortBy: SortBy | undefined): string | undefined {
  if (sortBy === 'percentage') return 'rating';
  return sortBy;
}

const progressWatchedRequest = (
  { fetch, page, limit, intent, sortBy, sortHow }: ProgressWatchedParams,
) => {
  const defaultSort = intent === 'continue'
    ? { sort_by: 'remaining', sort_how: 'asc' as const }
    : {};

  return api({ fetch })
    .sync
    .progress
    .upNext
    .nitro({
      query: {
        page,
        limit,
        intent,
        ...defaultSort,
        ...(sortBy ? { sort_by: mapToNitroSortBy(sortBy) } : {}),
        ...(sortHow ? { sort_how: sortHow } : {}),
      },
    });
};

export const progressWatchedQuery = defineInfiniteQuery({
  key: 'progressWatched',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Drop('show'),
    InvalidateAction.Restore,
    InvalidateAction.Rewatching('show'),
  ],
  dependencies: (params: ProgressWatchedParams) => [
    params.page,
    params.limit,
    params.intent,
    params.sortBy,
    params.sortHow,
  ],
  request: progressWatchedRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToWatchedProgressEntry),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(WatchedProgressEntrySchema),
  ttl: time.minutes(30),
});
