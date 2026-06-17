import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

const CountBlockSchema = z.object({
  movies: z.number().optional(),
  episodes: z.number().optional(),
  shows: z.number().optional(),
  seasons: z.number().optional(),
});

export const PlexSyncSchema = z.object({
  id: z.number(),
  key: z.string(),
  createdAt: z.date(),
  undone: z.boolean(),
  undoneAt: z.date().nullable(),
  items: z.object({
    history: CountBlockSchema.optional(),
    library: CountBlockSchema.optional(),
    ratings: CountBlockSchema.optional(),
    watchlist: CountBlockSchema.optional(),
  }),
  pausedCount: z.number(),
  skippedCount: z.number(),
});

export type PlexSync = z.infer<typeof PlexSyncSchema>;

const plexDataSyncsRequest = ({ fetch, page }: ApiParams & { page?: number }) =>
  api({ fetch }).users.syncs.listByType({
    params: { type: 'plex' },
    query: { limit: 20, page },
  });

function mapToPlexSync(raw: {
  id: number;
  created_at: string;
  undone: boolean;
  undone_at: string | null;
  items: {
    history?: {
      movies?: number;
      episodes?: number;
      shows?: number;
      seasons?: number;
    };
    library?: {
      movies?: number;
      episodes?: number;
      shows?: number;
      seasons?: number;
    };
    ratings?: {
      movies?: number;
      episodes?: number;
      shows?: number;
      seasons?: number;
    };
    watchlist?: {
      movies?: number;
      episodes?: number;
      shows?: number;
      seasons?: number;
    };
  };
  paused_count: number;
  skipped_count: number;
}): PlexSync {
  return {
    id: raw.id,
    key: `sync-${raw.id}`,
    createdAt: new Date(raw.created_at),
    undone: raw.undone,
    undoneAt: raw.undone_at ? new Date(raw.undone_at) : null,
    items: raw.items,
    pausedCount: raw.paused_count,
    skippedCount: raw.skipped_count,
  };
}

export const plexDataSyncsQuery = defineInfiniteQuery({
  key: 'plexDataSyncs',
  invalidations: [InvalidateAction.Plex.Syncs],
  dependencies: () => [],
  request: plexDataSyncsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToPlexSync),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(PlexSyncSchema),
  ttl: time.minutes(5),
});
