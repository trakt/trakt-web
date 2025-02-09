import type { ListedShow } from '$lib/requests/queries/lists/listShowItemsQuery.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';

export const ListedShowsMappedMock: ListedShow[] = [
  {
    'entry': {
      ...ShowSiloMappedMock,
      'episode': {
        'count': 15,
      },
    },
    'id': 1234,
    'listedAt': new Date('2024-12-27T21:34:14.000Z'),
    'notes': null,
    'rank': 1,
    'type': 'show',
  },
];
