import { http, HttpResponse } from 'msw';

import { EpisodeLibraryResponseMock } from '../data/sync/response/EpisodeLibraryResponseMock.ts';
import { MovieLibraryResponseMock } from '../data/sync/response/MovieLibraryResponseMock.ts';
import { UpNextResponseMock } from '../data/sync/response/UpNextResponseMock.ts';
import { UserPlexEpisodeLibraryResponseMock } from '../data/users/response/UserPlexEpisodeLibraryResponseMock.ts';
import { UserPlexMovieLibraryResponseMock } from '../data/users/response/UserPlexMovieLibraryResponseMock.ts';
import { UserPlexShowLibraryResponseMock } from '../data/users/response/UserPlexShowLibraryResponseMock.ts';

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
    'http://localhost/sync/collection/movies',
    ({ request }) => {
      const url = new URL(request.url);
      const isMinRequest = url.searchParams.get('extended') === 'min';

      return isMinRequest
        ? HttpResponse.json(UserPlexMovieLibraryResponseMock)
        : HttpResponse.json(MovieLibraryResponseMock);
    },
  ),
  http.get(
    'http://localhost/sync/collection/episodes',
    ({ request }) => {
      const url = new URL(request.url);
      const isMinRequest = url.searchParams.get('extended') === 'min';

      return isMinRequest
        ? HttpResponse.json(UserPlexEpisodeLibraryResponseMock)
        : HttpResponse.json(EpisodeLibraryResponseMock);
    },
  ),
  http.get(
    'http://localhost/sync/collection/shows',
    ({ request }) => {
      const url = new URL(request.url);
      const isMinRequest = url.searchParams.get('extended') === 'min';

      return isMinRequest
        ? HttpResponse.json(UserPlexShowLibraryResponseMock)
        : HttpResponse.json([]);
    },
  ),
];
