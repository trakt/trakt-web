import type { ListedItem } from '$lib/requests/queries/users/userListItemsQuery.ts';
import { ShowSiloMinimalMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMinimalMappedMock.ts';

export const AllListedShowsMappedMock: ListedItem[] = [
  {
    'entry': {
      ...ShowSiloMinimalMappedMock,
      'colors': ['transparent', 'transparent'],
      'episode': {
        'count': 20,
      },
    },
    'id': 1234,
    'listedAt': new Date('2024-12-27T21:34:14.000Z'),
    'notes': null,
    'rank': 1,
    'type': 'show',
  },
];
