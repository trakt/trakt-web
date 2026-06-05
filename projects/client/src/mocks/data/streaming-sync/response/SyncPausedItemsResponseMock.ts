import type { SyncItemResponse } from '@trakt/api';

export const SyncPausedItemsResponseMock: SyncItemResponse[] = [
  {
    kind: 'history',
    type: 'episode',
    trakt_item: {
      type: 'episode',
      season: 1,
      number: 3,
      title: 'The Pollard Incident',
      ids: {
        trakt: 73482,
        tmdb: 63057,
      },
      show: {
        type: 'show',
        title: 'The Last of Us',
        year: 2023,
        ids: {
          trakt: 158463,
          slug: 'the-last-of-us',
        },
      },
    },
    service_id: 'amazon',
    content_id: 'B0PAUSED01',
    tmdb_id: 63057,
    tmdb_series_id: 100088,
    watched_at: '2024-06-01T20:00:00.000Z',
    progress: 42.5,
  },
];
