import { http, HttpResponse } from 'msw';

import { RecommendedMoviesResponseMock } from '../data/recommendations/response/RecommendedMoviesResponseMock.ts';
import { RecommendedShowsResponseMock } from '../data/recommendations/response/RecommendedShowsResponseMock.ts';

export const recommendations = [
  http.get('http://localhost/shows/recommendations/anticipated', () => {
    return HttpResponse.json(RecommendedShowsResponseMock);
  }),
  http.get('http://localhost/movies/recommendations/anticipated', () => {
    return HttpResponse.json(RecommendedMoviesResponseMock);
  }),
  http.get('http://localhost/media/recommendations/anticipated', () => {
    return HttpResponse.json([
      ...RecommendedMoviesResponseMock,
      ...RecommendedShowsResponseMock,
    ]);
  }),
  http.get('http://localhost/shows/recommendations', () => {
    return HttpResponse.json(RecommendedShowsResponseMock);
  }),
  http.get('http://localhost/movies/recommendations', () => {
    return HttpResponse.json(RecommendedMoviesResponseMock);
  }),
];
