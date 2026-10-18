import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToSmartListItem } from '$lib/requests/_internal/mapToSmartListItem.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { SmartListItemSchema } from '$lib/requests/models/SmartListItem.ts';
import { time } from '$lib/utils/timing/time.ts';

type SmartListItemsParams = { slug: string } & PaginationParams &
  ApiParams &
  FilterParams;

const smartListItemsRequest = ({
  fetch,
  slug,
  limit,
  page,
  filter,
}: SmartListItemsParams) =>
  api({ fetch }).smart_lists.items({
    params: {
      list_id: slug,
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
  invalidations: [InvalidateAction.SmartList.Edited],
  dependencies: (params: SmartListItemsParams) => [
    params.slug,
    params.limit,
    params.page,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: smartListItemsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToSmartListItem),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(SmartListItemSchema),
  ttl: time.minutes(30),
});
