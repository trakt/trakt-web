import { http, HttpResponse } from 'msw';

import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/ShowSiloResponseMock.ts';
import { MovieHereticLanguageResponseMock } from './data/summary/movies/heretic/MovieHereticLanguageResponseMock.ts';
import { MovieHereticResponseMock } from './data/summary/movies/heretic/MovieHereticResponseMock.ts';
import { ShowSiloLanguageResponseMock } from './data/summary/shows/silo/ShowSiloLanguageResponseMock.ts';
import { ExtendedUsersResponseMock } from './data/users/ExtendedUserSettingsResponseMock.ts';

export const handlers = [
  http.get('http://localhost/users/settings', () => {
    return HttpResponse.json(ExtendedUsersResponseMock);
  }),
  http.get(
    `http://localhost/movies/${MovieHereticResponseMock.ids.slug}`,
    () => {
      return HttpResponse.json(MovieHereticResponseMock);
    },
  ),
  http.get(
    `http://localhost/movies/${MovieHereticResponseMock.ids.slug}/translations/*`,
    () => {
      return HttpResponse.json(MovieHereticLanguageResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}`,
    () => {
      return HttpResponse.json(ShowSiloResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/translations/*`,
    () => {
      return HttpResponse.json(
        ShowSiloLanguageResponseMock,
      );
    },
  ),
];
