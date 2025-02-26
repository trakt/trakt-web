import type { WatchlistShow } from '$lib/requests/queries/users/showWatchlistQuery.ts';
import { ShowSiloMinimalMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMinimalMappedMock.ts';

export const WatchlistShowsMappedMock: WatchlistShow[] = [
  {
    'id': 1146015487,
    'listedAt': new Date('2024-12-27T21:36:48.000Z'),
    'notes': null,
    'rank': 1,
    'type': 'show',
    'entry': {
      'episode': {
        'count': 20,
      },
      ...ShowSiloMinimalMappedMock,
    },
  },
];
