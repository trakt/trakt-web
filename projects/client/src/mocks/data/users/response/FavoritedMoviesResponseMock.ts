import type { FavoriteMovieResponse } from '@trakt/api';
import { MovieHereticResponseMock } from '../../summary/movies/heretic/response/MovieHereticResponseMock.ts';

export const FavoritedMoviesResponseMock: FavoriteMovieResponse[] = [
  {
    'rank': 1,
    'id': 1157183360,
    'listed_at': '2025-01-16T17:37:18.000Z',
    'notes': null,
    'type': 'movie',
    'movie': MovieHereticResponseMock,
  },
];
