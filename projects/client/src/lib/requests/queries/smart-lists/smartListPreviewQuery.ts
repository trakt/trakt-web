import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { getRecordDependencies } from '$lib/requests/_internal/getRecordDependencies.ts';
import { mapToSmartListItem } from '$lib/requests/_internal/mapToSmartListItem.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { SmartListItemSchema } from '$lib/requests/models/SmartListItem.ts';
import { SmartListItemResponseSchema } from '$lib/requests/models/SmartListItemResponse.ts';
import type { SmartListMediaType } from '$lib/requests/models/SmartListMediaType.ts';
import type { SmartListSource } from '$lib/requests/models/SmartListSource.ts';
import { time } from '$lib/utils/timing/time.ts';
import { buildParamString } from '$lib/utils/url/buildParamString.ts';

type SmartListPreviewParams =
  & {
    source: SmartListSource;
    mediaType: SmartListMediaType;
    filters: Record<string, string>;
  }
  & PaginationParams
  & ApiParams;

const smartListPreviewRequest = async (
  { fetch, source, mediaType, filters, limit, page }: SmartListPreviewParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: `/smart-lists/preview/items${
      buildParamString({
        ...filters,
        source,
        media_type: mediaType,
        extended: 'full,images,colors',
        page,
        limit,
      })
    }`,
  });

  if (!response.ok) {
    throw new Error(`Smart list preview failed (${response.status})`);
  }

  return {
    body: SmartListItemResponseSchema.array().parse(await response.json()),
    headers: response.headers,
    status: 200 as const,
  };
};

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
