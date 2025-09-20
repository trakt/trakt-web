import type { FavoritedEntry } from '$lib/requests/models/FavoritedEntry.ts';
import { MovieHereticMappedMock } from '../../summary/movies/heretic/mapped/MovieHereticMappedMock.ts';

export const FavoritedMoviesMappedMock: FavoritedEntry[] = [
  {
    'favoritedAt': new Date('2025-01-16T17:37:18.000Z'),
    'id': 916302,
    'rank': 1,
    'item': MovieHereticMappedMock,
  },
];
