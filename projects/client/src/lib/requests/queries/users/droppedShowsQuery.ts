import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import {
  type DroppedProgressEntry,
  DroppedProgressEntrySchema,
} from '$lib/requests/models/ProgressEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { HiddenShowItemResponse } from '@trakt/api';

type DroppedShowsParams = PaginationParams & ApiParams;

function mapToDroppedProgressEntry(
  item: HiddenShowItemResponse,
): DroppedProgressEntry {
  const show = mapToShowEntry(item.show);

  return {
    key: show.key,
    type: 'dropped',
    show,
    hiddenAt: new Date(item.hidden_at),
  };
}

const droppedShowsRequest = (
  { fetch, page = 1, limit }: DroppedShowsParams,
) =>
  api({ fetch })
    .users
    .hidden
    .dropped({
      query: {
        page,
        limit,
        extended: 'full,images',
      },
    });

export const droppedShowsQuery = defineInfiniteQuery({
  key: 'droppedShows',
  invalidations: [
    InvalidateAction.Drop('show'),
    InvalidateAction.Restore,
  ],
  dependencies: (params: DroppedShowsParams) => [
    params.page,
    params.limit,
  ],
  request: droppedShowsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToDroppedProgressEntry),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(DroppedProgressEntrySchema),
  ttl: time.hours(1),
});
