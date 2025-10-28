import type { MovieActivityHistory } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';

export const MovieActivityHistoryMappedMock: MovieActivityHistory[] = [
  {
    'id': 1,
    'key': 'movie-1',
    'movie': MovieHereticMappedMock,
    'type': 'movie',
    'watchedAt': new Date('2025-01-31T23:12:41.000Z'),
  },
];
