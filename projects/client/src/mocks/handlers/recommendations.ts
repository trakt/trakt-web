import { http, HttpResponse } from 'msw';

import { RecommendedMoviesResponseMock } from '../data/recommendations/response/RecommendedMoviesResponseMock.ts';
import { RecommendedShowsResponseMock } from '../data/recommendations/response/RecommendedShowsResponseMock.ts';

export const recommendations = [
  http.get(
    'http://localhost/shows/recommendations',
    () => {
      return HttpResponse.json(RecommendedShowsResponseMock);
    },
  ),
  http.get(
    'http://localhost/movies/recommendations',
    () => {
      return HttpResponse.json(RecommendedMoviesResponseMock);
    },
  ),
];
