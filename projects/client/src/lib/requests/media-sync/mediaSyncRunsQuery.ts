import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import { InvalidateAction } from '../models/InvalidateAction.ts';
import {
  type MediaSyncRun,
  MediaSyncRunSchema,
} from './models/MediaSyncRun.ts';

type MediaSyncRunsParams = { connectionId: number } & ApiParams;

export const MediaSyncRunResponseSchema = z.object({
  id: z.number(),
  library_id: z.number().nullable(),
  kind: z.enum(['full', 'incremental', 'invalidate', 'webhook']),
  feed: z.string(),
  status: z.enum(['planned', 'running', 'completed', 'failed', 'aborted']),
  items_seen: z.number(),
  items_written: z.number(),
  items_removed: z.number(),
  error: z.string().nullable(),
  created_at: z.string(),
  finished_at: z.string().nullable(),
});

type MediaSyncRunResponse = z.infer<typeof MediaSyncRunResponseSchema>;

function mapToMediaSyncRun(run: MediaSyncRunResponse): MediaSyncRun {
  return {
    id: run.id,
    libraryId: run.library_id,
    kind: run.kind,
    feed: run.feed,
    status: run.status,
    itemsSeen: run.items_seen,
    itemsWritten: run.items_written,
    itemsRemoved: run.items_removed,
    error: run.error,
    createdAt: new Date(run.created_at),
    finishedAt: run.finished_at == null ? null : new Date(run.finished_at),
  };
}

const mediaSyncRunsRequest = async (
  { fetch, connectionId }: MediaSyncRunsParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/sync/connections/${connectionId}/runs`,
  });
  if (!response.ok) {
    throw new Error(`Failed to load media server syncs: ${response.status}`);
  }
  return {
    body: z.array(MediaSyncRunResponseSchema).parse(await response.json()),
    status: 200,
  };
};

export const mediaSyncRunsQuery = defineQuery({
  key: 'mediaSyncRuns',
  invalidations: [
    InvalidateAction.MediaSync.Runs,
    InvalidateAction.MediaSync.Connections,
  ],
  dependencies: (params) => [params.connectionId],
  request: mediaSyncRunsRequest,
  mapper: (response) => response.body.map(mapToMediaSyncRun),
  schema: z.array(MediaSyncRunSchema),
  ttl: time.minutes(1),
});
