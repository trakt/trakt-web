import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToSmartListPosters } from '$lib/requests/_internal/mapToSmartListPosters.ts';
import { smartListPreviewItemsRequest } from '$lib/requests/_internal/smartListPreviewItemsRequest.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { SmartListMediaType } from '$lib/requests/models/SmartListMediaType.ts';
import type { SmartListSource } from '$lib/requests/models/SmartListSource.ts';
import { getRecordDependencies } from '$lib/requests/_internal/getRecordDependencies.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

const PREVIEW_LIMIT = 3;

type SmartListTemplatePreviewParams = {
  source: SmartListSource;
  mediaType: SmartListMediaType;
  filters: Record<string, string>;
} & ApiParams;

const SmartListTemplatePreviewSchema = z.object({
  total: z.number(),
  posters: z.string().array(),
});

const smartListTemplatePreviewRequest = (
  params: SmartListTemplatePreviewParams,
) =>
  smartListPreviewItemsRequest({
    ...params,
    extended: 'images',
    page: 1,
    limit: PREVIEW_LIMIT,
  });

export const smartListTemplatePreviewQuery = defineQuery({
  key: 'smartListTemplatePreview',
  invalidations: [
    InvalidateAction.MarkAsWatched('movie'),
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.Watchlisted('show'),
  ],
  dependencies: (params: SmartListTemplatePreviewParams) => [
    params.source,
    params.mediaType,
    ...getRecordDependencies(params.filters),
  ],
  request: smartListTemplatePreviewRequest,
  mapper: (response) => ({
    total: Number(response.headers.get('x-pagination-item-count') ?? 0),
    posters: mapToSmartListPosters(response.body),
  }),
  schema: SmartListTemplatePreviewSchema,
  ttl: time.minutes(5),
});
