import { http, HttpResponse } from 'msw';

import { RecommendedMoviesResponseMock } from '../data/recommendations/response/RecommendedMoviesResponseMock.ts';
import { RecommendedShowsResponseMock } from '../data/recommendations/response/RecommendedShowsResponseMock.ts';

export const recommendations = [
  http.get(
    'http://localhost/recommendations/shows/*',
    () => {
      return HttpResponse.json(RecommendedShowsResponseMock);
    },
  ),
  http.get(
    'http://localhost/recommendations/movies/*',
    () => {
      return HttpResponse.json(RecommendedMoviesResponseMock);
    },
  ),
];
