import type { ListItem } from '$lib/requests/models/ListItem.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';

export const ListedShowsMappedMock: ListItem[] = [
  {
    'entry': {
      ...ShowSiloMappedMock,
      'episode': {
        'count': 15,
      },
    },
    'id': 1234,
    'key': 'show-1234',
    'listedAt': new Date('2024-12-27T21:34:14.000Z'),
    'notes': null,
    'rank': 1,
    'type': 'show',
  },
];
