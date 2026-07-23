import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import type { TrendingSearchMovieResultResponse } from '@trakt/api';

export const TrendingSearchedMoviesResponseMock:
  TrendingSearchMovieResultResponse[] = [
    {
      id: MovieHereticResponseMock.ids.trakt,
      count: 100,
      type: 'movie',
      movie: MovieHereticResponseMock,
    },
  ];
