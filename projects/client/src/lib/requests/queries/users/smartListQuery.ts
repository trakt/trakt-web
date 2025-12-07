import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { FilterResponse } from '@trakt/api';
import { z } from 'zod';
import { type MediaType, MediaTypeSchema } from '../../models/MediaType.ts';
import type { PaginationParams } from '../../models/PaginationParams.ts';

type SavedFilterParams =
  & { type: MediaType }
  & PaginationParams
  & ApiParams
  & FilterParams;

const SmartListTargetSchema = z.enum([
  'trending',
  'popular',
  'anticipated',
  'unknown',
]);
export type SmartListTarget = z.infer<typeof SmartListTargetSchema>;

const SmartListSchema = z.object({
  title: z.string(),
  target: SmartListTargetSchema,
  type: MediaTypeSchema,
  params: z.record(z.string(), z.string()),
});

function mapToType(
  section: string,
): MediaType {
  switch (section) {
    case 'movies':
      return 'movie';
    case 'shows':
      return 'show';
    default:
      throw new Error(`Unsupported section: ${section}`);
  }
}

function mapToTarget(path: string): SmartListTarget {
  if (path.endsWith('/trending')) {
    return 'trending';
  }

  if (path.endsWith('/popular')) {
    return 'popular';
  }

  if (path.endsWith('/anticipated')) {
    return 'anticipated';
  }

  return 'unknown';
}

function mapToSmartList(
  entry: FilterResponse,
): SmartList {
  return {
    title: entry.name,
    type: mapToType(entry.section),
    target: mapToTarget(entry.path),
    params: Object.fromEntries(new URLSearchParams(entry.query)),
  };
}

export type SmartList = z.infer<typeof SmartListSchema>;

const smartListRequest = (
  { fetch, type }: SavedFilterParams,
) =>
  api({ fetch })
    .users
    .filters
    .saved({
      params: {
        section: `${type}s`,
      },
    });

export const smartListQuery = defineInfiniteQuery({
  key: (params: SavedFilterParams) => `${params.type}SavedFilters`,
  invalidations: [],
  dependencies: (
    params: SavedFilterParams,
  ) => [
    params.limit,
    params.page,
  ],
  request: smartListRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToSmartList),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(SmartListSchema),
  ttl: time.seconds(1),
});
