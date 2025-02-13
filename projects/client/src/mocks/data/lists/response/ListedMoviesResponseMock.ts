import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import type { ListedMovieResponse } from '@trakt/api';

export const ListedMoviesResponseMock: ListedMovieResponse[] = [
  {
    'rank': 1,
    'id': 1146014560,
    'listed_at': '2024-12-27T21:34:14.000Z',
    'notes': null,
    'type': 'movie',
    'movie': MovieHereticResponseMock,
  },
];
