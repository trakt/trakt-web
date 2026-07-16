import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { SmartListDefinitionResponse } from '@trakt/api';
import { z } from 'zod';
import { InvalidateAction } from '../../models/InvalidateAction.ts';

const SmartListSourceSchema = z.enum([
  'trending',
  'popular',
  'anticipated',
  'recommendations',
  'discover',
]);
export type SmartListSource = z.infer<typeof SmartListSourceSchema>;

const SmartListMediaTypeSchema = z.enum(['movies', 'shows', 'media']);
export type SmartListMediaType = z.infer<typeof SmartListMediaTypeSchema>;

const SmartListPrivacySchema = z.enum(['public', 'private', 'friends']);

const list = z.string().array().optional();
const range = z.number().array().optional();

const SmartListFiltersSchema = z.object({
  genres: list,
  subgenres: list,
  certifications: list,
  languages: list,
  countries: list,
  statuses: list,
  networks: list,
  watchnow: list,
  years: range,
  ratings: range,
  runtimes: range,
  imdb_ratings: range,
  rt_meters: range,
  rt_user_meters: range,
  ignore_watched: z.boolean().optional(),
  ignore_watchlisted: z.boolean().optional(),
});
export type SmartListFilters = z.infer<typeof SmartListFiltersSchema>;

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
