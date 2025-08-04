import { http, HttpResponse } from 'msw';

import { UpNextResponseMock } from '../data/sync/response/UpNextResponseMock.ts';
import { UserPlexEpisodeCollectionResponseMock } from '../data/users/response/UserPlexEpisodeCollectionResponseMock.ts';
import { UserPlexMovieCollectionResponseMock } from '../data/users/response/UserPlexMovieCollectionResponseMock.ts';
import { UserPlexShowCollectionResponseMock } from '../data/users/response/UserPlexShowCollectionResponseMock.ts';

export const sync = [
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
    'http://localhost/sync/ratings',
    () => {
      return new HttpResponse(null, {
        status: 201,
      });
    },
  ),
  http.post(
    'http://localhost/sync/favorites',
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
  http.post(
    'http://localhost/sync/ratings/remove',
    () => {
      return new HttpResponse(null, {
        status: 200,
      });
    },
  ),
  http.post(
    'http://localhost/sync/favorites/remove',
    () => {
      return new HttpResponse(null, {
        status: 200,
      });
    },
  ),
  http.get(
    'http://localhost/sync/progress/up_next*',
    () => {
      return HttpResponse.json(UpNextResponseMock);
    },
  ),
  http.get(
    'http://localhost/sync/collection/movies*',
    () => {
      return HttpResponse.json(UserPlexMovieCollectionResponseMock);
    },
  ),
  http.get(
    'http://localhost/sync/collection/shows*',
    () => {
      return HttpResponse.json(UserPlexShowCollectionResponseMock);
    },
  ),
  http.get(
    'http://localhost/sync/collection/episodes*',
    () => {
      return HttpResponse.json(UserPlexEpisodeCollectionResponseMock);
    },
  ),
];
