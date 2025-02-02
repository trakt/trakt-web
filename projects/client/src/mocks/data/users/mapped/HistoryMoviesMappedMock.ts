import type { HistoryMovie } from '$lib/requests/queries/users/movieHistoryQuery';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock';

export const HistoryMoviesMappedMock: HistoryMovie[] = [
  {
    'id': 1,
    'movie': MovieHereticMappedMock,
    'type': 'movie',
    'watchedAt': new Date('2025-01-31T23:12:41.000Z'),
  },
];
