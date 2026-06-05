import type { SyncResponse } from '@trakt/api';

export const DataSyncsResponseMock: SyncResponse[] = [
  {
    id: 117,
    created_at: '2025-02-19T12:53:00.000Z',
    kind: 'younify',
    source: 'amazon',
    application: 'Younify',
    undone: false,
    undone_at: null,
    items: {
      history: { episodes: 11 },
    },
    paused_count: 0,
    skipped_count: 244,
  },
  {
    id: 116,
    created_at: '2025-02-19T12:51:00.000Z',
    kind: 'younify',
    source: 'amazon',
    application: 'Younify',
    undone: true,
    undone_at: '2025-02-19T13:00:00.000Z',
    items: {
      history: { episodes: 11 },
    },
    paused_count: 0,
    skipped_count: 93,
  },
];
