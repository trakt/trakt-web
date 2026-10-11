import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { SmartListDefinitionResponse } from '@trakt/api';
import { z } from 'zod';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import {
  type SmartListFilters,
  SmartListFiltersSchema,
} from '../../models/SmartListFilters.ts';
import {
  type SmartListMediaType,
  SmartListMediaTypeSchema,
} from '../../models/SmartListMediaType.ts';
import {
  type SmartListSource,
  SmartListSourceSchema,
} from '../../models/SmartListSource.ts';

export type { SmartListFilters, SmartListMediaType, SmartListSource };

const SmartListPrivacySchema = z.enum(['public', 'private', 'friends']);

export const SmartListSchema = z.object({
  key: z.string(),
  title: z.string(),
  slug: z.string(),
  id: z.number(),
  source: SmartListSourceSchema,
  mediaType: SmartListMediaTypeSchema,
  privacy: SmartListPrivacySchema,
  filters: SmartListFiltersSchema,
  posters: z.string().array(),
  updatedAt: z.date(),
});
export type SmartList = z.infer<typeof SmartListSchema>;

export function mapToSmartList(
  entry: SmartListDefinitionResponse,
): SmartList {
  return {
    key: `smart-list-${entry.ids.slug}`,
    title: entry.name,
    slug: entry.ids.slug,
    id: entry.ids.trakt,
    source: entry.source as SmartListSource,
    mediaType: entry.media_type as SmartListMediaType,
    privacy: entry.privacy as SmartList['privacy'],
    filters: entry.filters,
    posters: entry.images.posters,
    updatedAt: new Date(entry.updated_at),
  };
}

type SmartListParams =
  & { userId?: string }
  & ApiParams;

const smartListRequest = (
  { fetch, userId }: SmartListParams,
) =>
  api({ fetch })
    .users
    .smartLists
    .personal({
      params: {
        id: userId ?? 'me',
      },
    });

export const smartListQuery = defineInfiniteQuery({
  key: (params: SmartListParams) => `smartLists-${params.userId ?? 'me'}`,
  invalidations: [
    InvalidateAction.SmartList.Created,
    InvalidateAction.SmartList.Edited,
    InvalidateAction.SmartList.Deleted,
  ],
  dependencies: (
    params: SmartListParams,
  ) => [
    params.userId ?? 'me',
  ],
  request: smartListRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToSmartList),
    page: { type: 'paginated' as const, current: 1, total: 1 },
  }),
  schema: PaginatableSchemaFactory(SmartListSchema),
  ttl: time.seconds(1),
});
