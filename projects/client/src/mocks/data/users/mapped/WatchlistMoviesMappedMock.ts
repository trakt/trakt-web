import type { WatchlistedItem } from '$lib/requests/queries/users/watchlistQuery.ts';
import { MovieMatrixMappedMock } from '../../summary/movies/matrix/MovieMatrixMappedMock.ts';

export const WatchlistMoviesMappedMock: WatchlistedItem[] = [
  {
    'id': 1146014560,
    'listedAt': new Date('2024-12-27T21:34:14.000Z'),
    'notes': null,
    'rank': 1,
    'type': 'movie',
    'entry': MovieMatrixMappedMock,
  },
];
