import { http, HttpResponse } from 'msw';

import { AuthResponseMock } from './data/auth/AuthResponseMock.ts';
import { MediaWatchingResponseMock } from './data/summary/common/response/MediaWatchingResponseMock.ts';
import { MovieHereticLanguageResponseMock } from './data/summary/movies/heretic/response/MovieHereticLanguageResponseMock.ts';
import { MovieHereticPeopleResponseMock } from './data/summary/movies/heretic/response/MovieHereticPeopleResponseMock.ts';
import { MovieHereticRatingsResponseMock } from './data/summary/movies/heretic/response/MovieHereticRatingsResponseMock.ts';
import { MovieHereticResponseMock } from './data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { MovieHereticStatsResponseMock } from './data/summary/movies/heretic/response/MovieHereticStatsResponseMock.ts';
import { MovieStudiosResponseMock } from './data/summary/movies/heretic/response/MovieStudiosResponseMock.ts';
import { ShowSiloLanguageResponseMock } from './data/summary/shows/silo/response/ShowSiloLanguageResponseMock.ts';
import { ShowSiloPeopleResponseMock } from './data/summary/shows/silo/response/ShowSiloPeopleResponseMock.ts';
import { ShowSiloPersonResponseMock } from './data/summary/shows/silo/response/ShowSiloPersonResponseMock.ts';
import { ShowSiloProgressResponseMock } from './data/summary/shows/silo/response/ShowSiloProgressResponseMock.ts';
import { ShowSiloRatingsResponseMock } from './data/summary/shows/silo/response/ShowSiloRatingsResponseMock.ts';
import { ShowSiloResponseMock } from './data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { ShowSiloSeasonsResponseMock } from './data/summary/shows/silo/response/ShowSiloSeasonsResponseMock.ts';
import { ShowSiloStatsResponseMock } from './data/summary/shows/silo/response/ShowSiloStatsResponseMock.ts';
import { ShowSiloStudiosResponseMock } from './data/summary/shows/silo/response/ShowSiloStudiosResponseMock.ts';
import { ExtendedUsersResponseMock } from './data/users/ExtendedUserSettingsResponseMock.ts';
import { FavoritedMoviesResponseMock } from './data/users/FavoritedMoviesResponseMock.ts';
import { FavoritedShowsResponseMock } from './data/users/FavoritedShowsResponseMock.ts';
import { RatedEpisodesResponseMock } from './data/users/RatedEpisodesResponseMock.ts';
import { RatedMoviesResponseMock } from './data/users/RatedMoviesResponseMock.ts';
import { WatchedMoviesResponseMock } from './data/users/WatchedMoviesResponseMock.ts';
import { WatchedShowsResponseMock } from './data/users/WatchedShowsResponseMock.ts';
import { WatchlistMoviesResponseMock } from './data/users/WatchlistMoviesResponseMock.ts';
import { WatchlistShowsResponseMock } from './data/users/WatchlistShowsResponseMock.ts';

const users = [
  http.get('http://localhost/users/settings', () => {
    return HttpResponse.json(ExtendedUsersResponseMock);
  }),
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
  http.get('http://localhost/users/me/ratings/movies', () => {
    return HttpResponse.json(RatedMoviesResponseMock);
  }),
  http.get('http://localhost/users/me/ratings/episodes', () => {
    return HttpResponse.json(RatedEpisodesResponseMock);
  }),
  http.get('http://localhost/users/me/favorites/movies/rank', () => {
    return HttpResponse.json(FavoritedMoviesResponseMock);
  }),
  http.get('http://localhost/users/me/favorites/shows/rank', () => {
    return HttpResponse.json(FavoritedShowsResponseMock);
  }),
];

const movies = [
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
    `http://localhost/movies/${MovieHereticResponseMock.ids.slug}/ratings`,
    () => {
      return HttpResponse.json(MovieHereticRatingsResponseMock);
    },
  ),
  http.get(
    `http://localhost/movies/${MovieHereticResponseMock.ids.slug}/stats`,
    () => {
      return HttpResponse.json(MovieHereticStatsResponseMock);
    },
  ),
  http.get(
    `http://localhost/movies/${MovieHereticResponseMock.ids.slug}/watching`,
    () => {
      return HttpResponse.json(MediaWatchingResponseMock);
    },
  ),
  http.get(
    `http://localhost/movies/${MovieHereticResponseMock.ids.slug}/studios`,
    () => {
      return HttpResponse.json(MovieStudiosResponseMock);
    },
  ),
  http.get(
    `http://localhost/movies/${MovieHereticResponseMock.ids.slug}/people`,
    () => {
      return HttpResponse.json(MovieHereticPeopleResponseMock);
    },
  ),
];

const shows = [
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
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/ratings`,
    () => {
      return HttpResponse.json(ShowSiloRatingsResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/stats`,
    () => {
      return HttpResponse.json(ShowSiloStatsResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/watching`,
    () => {
      return HttpResponse.json(MediaWatchingResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/studios`,
    () => {
      return HttpResponse.json(ShowSiloStudiosResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/people`,
    () => {
      return HttpResponse.json(ShowSiloPeopleResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/progress/watched`,
    () => {
      return HttpResponse.json(ShowSiloProgressResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/seasons`,
    () => {
      return HttpResponse.json(ShowSiloSeasonsResponseMock);
    },
  ),
];

const sync = [
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
];

const people = [
  http.get(
    `http://localhost/people/${ShowSiloPersonResponseMock.ids.slug}`,
    () => {
      return HttpResponse.json(ShowSiloPersonResponseMock);
    },
  ),
];

const auth = [
  http.post(`${TRAKT_TARGET_ENVIRONMENT}/oauth/token`, () => {
    return HttpResponse.json(AuthResponseMock);
  }),
];

export const handlers = [
  ...users,
  ...movies,
  ...shows,
  ...sync,
  ...auth,
  ...people,
];
