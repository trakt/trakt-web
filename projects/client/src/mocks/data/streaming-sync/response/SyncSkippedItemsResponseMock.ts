import type { SyncItemResponse } from '@trakt/api';

export const SyncSkippedItemsResponseMock: SyncItemResponse[] = [
  {
    kind: 'history',
    type: null,
    trakt_item: null,
    service_id: 'amazon',
    content_id: 'B00ABC1234',
    tmdb_id: null,
    tmdb_series_id: null,
    watched_at: '2011-12-05T23:09:00.000Z',
    progress: 0,
  },
  {
    kind: 'history',
    type: 'movie',
    trakt_item: {
      type: 'movie',
      title: 'Air Force One',
      year: 1997,
      ids: {
        trakt: 9772,
        slug: 'air-force-one-1997',
        imdb: 'tt0118571',
        tmdb: 9772,
      },
    },
    service_id: 'amazon',
    content_id: 'B00DEF5678',
    tmdb_id: 9772,
    tmdb_series_id: null,
    watched_at: '2011-12-05T23:10:00.000Z',
    progress: 0,
  },
];
