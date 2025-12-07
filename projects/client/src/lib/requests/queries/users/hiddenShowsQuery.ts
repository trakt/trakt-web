import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import {
  type HiddenShow,
  HiddenShowSchema,
} from '$lib/requests/models/HiddenShow.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { HiddenShowItemResponse } from '@trakt/api';

type HiddenShowsParams = PaginationParams & ApiParams;

function mapToHiddenShowItem(item: HiddenShowItemResponse): HiddenShow {
  return {
    hiddenAt: new Date(item.hidden_at),
    show: mapToShowEntry(item.show),
  };
}

export const DEFAULT_HIDDEN_PAGE_SIZE = 1000;
const hiddenShowsRequest = (
  { fetch, limit = DEFAULT_HIDDEN_PAGE_SIZE, page }: HiddenShowsParams,
) =>
  api({ fetch })
    .users
    .hidden
    .get({
      query: {
        page,
        limit,
        type: 'show',
      },
    });

export const hiddenShowsQuery = defineInfiniteQuery({
  key: 'hiddenShows',
  invalidations: [InvalidateAction.Restore],
  dependencies: (
    params: HiddenShowsParams,
  ) => [params.limit, params.page],
  request: hiddenShowsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToHiddenShowItem),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(HiddenShowSchema),
  ttl: time.days(1),
});
