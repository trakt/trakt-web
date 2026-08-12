import type {
  CollectionMinimalResponse,
  CollectionMinimalShowResponse,
} from '@trakt/api';
import { http, HttpResponse } from 'msw';

import { MediaLibraryResponseMock } from '../data/sync/response/MediaLibraryResponseMock.ts';
import { UpNextResponseMock } from '../data/sync/response/UpNextResponseMock.ts';
import { UserPlexEpisodeLibraryResponseMock } from '../data/users/response/UserPlexEpisodeLibraryResponseMock.ts';
import { UserPlexMovieLibraryResponseMock } from '../data/users/response/UserPlexMovieLibraryResponseMock.ts';
import { UserPlexShowLibraryResponseMock } from '../data/users/response/UserPlexShowLibraryResponseMock.ts';

function paginatedCollection(
  request: Request,
  items: CollectionMinimalResponse | CollectionMinimalShowResponse,
) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? 1);
  const limit = searchParams.get('limit');

  return HttpResponse.json(page > 1 ? {} : items, {
    headers: limit == null ? undefined : {
      'x-pagination-page': `${page}`,
      'x-pagination-limit': limit,
    },
  });
}

export const sync = [
  http.post(
    'http://localhost/checkin',
    () => {
      return HttpResponse.json({}, {
        status: 201,
      });
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
  http.post(
    'http://localhost/sync/collection/remove',
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
    'http://localhost/sync/collection/media',
    () => {
      return HttpResponse.json(MediaLibraryResponseMock);
    },
  ),
  http.get(
    'http://localhost/sync/collection/minimal/movies',
    ({ request }) =>
      paginatedCollection(request, UserPlexMovieLibraryResponseMock),
  ),
  http.get(
    'http://localhost/sync/collection/minimal/episodes',
    ({ request }) =>
      paginatedCollection(request, UserPlexEpisodeLibraryResponseMock),
  ),
  http.get(
    'http://localhost/sync/collection/minimal/shows',
    ({ request }) =>
      paginatedCollection(request, UserPlexShowLibraryResponseMock),
  ),
];
