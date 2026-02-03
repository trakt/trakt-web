import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import {
  type HiddenShow,
  HiddenShowSchema,
} from '$lib/requests/models/HiddenShow.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { HiddenShowItemResponse } from '@trakt/api';
import type { LimitParams } from '../../models/LimitParams.ts';

type HiddenShowsParams = LimitParams & ApiParams;

function mapToHiddenShowItem(item: HiddenShowItemResponse): HiddenShow {
  return {
    hiddenAt: new Date(item.hidden_at),
    show: mapToShowEntry(item.show),
  };
}

export const DEFAULT_HIDDEN_PAGE_SIZE = 1000;
const hiddenShowsRequest = (
  { fetch, limit = DEFAULT_HIDDEN_PAGE_SIZE }: HiddenShowsParams,
) =>
  api({ fetch })
    .users
    .hidden
    .get({
      query: {
        limit,
        type: 'show',
      },
    });

export const hiddenShowsQuery = defineQuery({
  key: 'hiddenShows',
  invalidations: [InvalidateAction.Restore],
  dependencies: (
    params: HiddenShowsParams,
  ) => [params.limit],
  request: hiddenShowsRequest,
  mapper: (response) => response.body.map(mapToHiddenShowItem),
  schema: HiddenShowSchema.array(),
  ttl: time.hours(3),
});
