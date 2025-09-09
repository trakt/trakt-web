import type { WatchlistedItem } from '$lib/requests/queries/users/watchlistQuery.ts';
import { ShowSiloMinimalMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMinimalMappedMock.ts';

export const WatchlistShowsMappedMock: WatchlistedItem[] = [
  {
    'id': 1146015487,
    'listedAt': new Date('2024-12-27T21:36:48.000Z'),
    'notes': null,
    'rank': 1,
    'type': 'show',

    'entry': {
      ...ShowSiloMinimalMappedMock,
      'colors': undefined,
    },
  },
];
