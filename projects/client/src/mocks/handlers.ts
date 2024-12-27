import { http, HttpResponse } from 'msw';

import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/ShowSiloResponseMock.ts';
import { MovieHereticLanguageResponseMock } from './data/summary/movies/heretic/MovieHereticLanguageResponseMock.ts';
import { MovieHereticResponseMock } from './data/summary/movies/heretic/MovieHereticResponseMock.ts';
import { ShowSiloLanguageResponseMock } from './data/summary/shows/silo/ShowSiloLanguageResponseMock.ts';
import { ExtendedUsersResponseMock } from './data/users/ExtendedUserSettingsResponseMock.ts';
import { WatchedMoviesResponseMock } from './data/users/WatchedMoviesResponseMock.ts';
import { WatchedShowsResponseMock } from './data/users/WatchedShowsResponseMock.ts';
import { WatchlistMoviesResponseMock } from './data/users/WatchlistMoviesResponseMock.ts';
import { WatchlistShowsResponseMock } from './data/users/WatchlistShowsResponseMock.ts';

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
  http.post(
    'http://localhost/sync/history',
    () => {
      return new HttpResponse(null, {
        status: 201,
      });
    },
  ),
  http.post(
    'http://localhost/sync/watchlist',
    () => {
      return new HttpResponse(null, {
        status: 201,
      });
    },
  ),
  http.post(
    'http://localhost/sync/history/remove',
    () => {
      return new HttpResponse(null, {
        status: 200,
      });
    },
  ),
  http.post(
    'http://localhost/sync/watchlist/remove',
    () => {
      return new HttpResponse(null, {
        status: 200,
      });
    },
  ),
  http.get('http://localhost/users/me/watched/shows', () => {
    return HttpResponse.json(WatchedShowsResponseMock);
  }),
  http.get('http://localhost/users/me/watched/movies', () => {
    return HttpResponse.json(WatchedMoviesResponseMock);
  }),
  http.get('http://localhost/users/me/watchlist/movies/rank', () => {
    return HttpResponse.json(WatchlistMoviesResponseMock);
  }),
  http.get('http://localhost/users/me/watchlist/shows/rank', () => {
    return HttpResponse.json(WatchlistShowsResponseMock);
  }),
];
