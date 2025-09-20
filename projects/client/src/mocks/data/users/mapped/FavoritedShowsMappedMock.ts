import type { FavoritedEntry } from '$lib/requests/models/FavoritedEntry.ts';
import { ShowSiloMappedMock } from '../../summary/shows/silo/mapped/ShowSiloMappedMock.ts';

export const FavoritedShowsMappedMock: FavoritedEntry[] = [
  {
    'favoritedAt': new Date('2025-01-16T17:37:41.000Z'),
    'id': 180770,
    'rank': 4,
    'item': ShowSiloMappedMock,
  },
];
