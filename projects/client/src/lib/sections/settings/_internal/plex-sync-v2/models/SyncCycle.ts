import type { MediaSyncRun } from '$lib/requests/media-sync/models/MediaSyncRun.ts';

export type SyncCycle = {
  id: number;
  kind: MediaSyncRun['kind'];
  startedAt: Date;
  status: 'running' | 'done' | 'failed';
  addedByFeed: Record<string, number>;
  itemsSeen: number;
  itemsRemoved: number;
  quietCount: number;
  quietSince: Date;
};
