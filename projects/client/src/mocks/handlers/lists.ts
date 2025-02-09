import { ListedMoviesResponseMock } from '$mocks/data/lists/response/ListedMoviesResponseMock.ts';
import { ListedShowsResponseMock } from '$mocks/data/lists/response/ListedShowsResponseMock.ts';

import { http, HttpResponse } from 'msw';

export const lists = [
  http.get('http://localhost/lists/*/items/movies*', () => {
    return HttpResponse.json(ListedMoviesResponseMock);
  }),
  http.get('http://localhost/lists/*/items/shows*', () => {
    return HttpResponse.json(ListedShowsResponseMock);
  }),
];
