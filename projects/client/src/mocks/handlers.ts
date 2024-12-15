import { http, HttpResponse } from 'msw';

import { MovieHereticLanguageResponseMock } from './data/summary/movies/heretic/MovieHereticLanguageResponseMock.ts';
import { MovieHereticResponseMock } from './data/summary/movies/heretic/MovieHereticResponseMock.ts';
import { ExtendedUsersResponseMock } from './data/users/ExtendedUserSettingsResponseMock.ts';

export const handlers = [
  http.get('/users/settings', () => {
    return HttpResponse.json(ExtendedUsersResponseMock);
  }),
  http.get(
    `/movies/${MovieHereticResponseMock.ids.slug}`,
    () => {
      return HttpResponse.json(MovieHereticResponseMock);
    },
  ),
  http.get(
    `/movies/${MovieHereticResponseMock.ids.slug}/translations/*`,
    () => {
      return HttpResponse.json(MovieHereticLanguageResponseMock);
    },
  ),
];
