import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { getRecordDependencies } from '$lib/requests/_internal/getRecordDependencies.ts';
import { mapToSmartListItem } from '$lib/requests/_internal/mapToSmartListItem.ts';
import { smartListPreviewItemsRequest } from '$lib/requests/_internal/smartListPreviewItemsRequest.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { SmartListItemSchema } from '$lib/requests/models/SmartListItem.ts';
import type { SmartListMediaType } from '$lib/requests/models/SmartListMediaType.ts';
import type { SmartListSource } from '$lib/requests/models/SmartListSource.ts';
import { time } from '$lib/utils/timing/time.ts';

type SmartListPreviewParams =
  & {
    source: SmartListSource;
    mediaType: SmartListMediaType;
    filters: Record<string, string>;
  }
  & PaginationParams
  & ApiParams;

const smartListPreviewRequest = (params: SmartListPreviewParams) =>
  smartListPreviewItemsRequest({
    ...params,
    extended: 'full,images,colors',
  });

export const smartListPreviewQuery = defineInfiniteQuery({
  key: 'smartListPreview',
  invalidations: [
    InvalidateAction.MarkAsWatched('movie'),
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.Watchlisted('show'),
  ],
  dependencies: (params: SmartListPreviewParams) => [
    params.source,
    params.mediaType,
    params.page,
    params.limit,
    ...getRecordDependencies(params.filters),
  ],
  request: smartListPreviewRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToSmartListItem),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(SmartListItemSchema),
  ttl: time.minutes(5),
});
