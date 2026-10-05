import type { MediaSyncRun } from '$lib/requests/media-sync/models/MediaSyncRun.ts';

export const MediaSyncRunsMappedMock: MediaSyncRun[] = [
  {
    id: 101,
    libraryId: null,
    kind: 'incremental',
    feed: 'history',
    status: 'completed',
    itemsSeen: 2,
    itemsWritten: 2,
    itemsRemoved: 0,
    error: null,
    createdAt: new Date('2026-10-05T09:00:00.000Z'),
    finishedAt: new Date('2026-10-05T09:00:12.000Z'),
  },
];
