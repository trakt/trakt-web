import { http, HttpResponse } from 'msw';

import { UpNextResponseMock } from '../data/sync/response/UpNextResponseMock.ts';

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
];
