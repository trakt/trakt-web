import { http, HttpResponse } from 'msw';

import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { ListedMoviesResponseMock } from '$mocks/data/lists/response/ListedMoviesResponseMock.ts';
import { ListedShowsResponseMock } from '$mocks/data/lists/response/ListedShowsResponseMock.ts';
import { HereticListsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/HereticListsMappedMock.ts';
import { SiloListsMappedMock } from '$mocks/data/summary/shows/silo/mapped/SiloListsMappedMock.ts';
import { SiloListsResponseMock } from '$mocks/data/summary/shows/silo/response/SiloListsResponseMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { CollaborationListsResponseMock } from '$mocks/data/users/response/CollaborationListsResponseMock.ts';
import { PersonalListsResponseMock } from '$mocks/data/users/response/PersonalListsResponseMock.ts';
import { RatedShowsResponseMock } from '$mocks/data/users/response/RatedShowsResponseMock.ts';
import { EpisodeActivityHistoryResponseMock } from '../data/users/response/EpisodeActivityHistoryResponseMock.ts';
import { ExtendedUsersResponseMock } from '../data/users/response/ExtendedUserSettingsResponseMock.ts';
import { MovieActivityHistoryResponseMock } from '../data/users/response/MovieActivityHistoryResponseMock.ts';
import { RatedEpisodesResponseMock } from '../data/users/response/RatedEpisodesResponseMock.ts';
import { RatedMoviesResponseMock } from '../data/users/response/RatedMoviesResponseMock.ts';
import { ShowActivityHistoryResponseMock } from '../data/users/response/ShowActivityHistoryResponseMock.ts';
import { SocialActivityResponseMock } from '../data/users/response/SocialActivityResponseMock.ts';
import { WatchedMoviesResponseMock } from '../data/users/response/WatchedMoviesResponseMock.ts';
import { WatchedShowsResponseMock } from '../data/users/response/WatchedShowsResponseMock.ts';
import { WatchlistMoviesResponseMock } from '../data/users/response/WatchlistMoviesResponseMock.ts';
import { WatchlistShowsResponseMock } from '../data/users/response/WatchlistShowsResponseMock.ts';

export const users = [
  http.get('http://localhost/users/settings', () => {
    return HttpResponse.json(ExtendedUsersResponseMock);
  }),
  http.get('http://localhost/users/me/watched/shows', () => {
    return HttpResponse.json(WatchedShowsResponseMock);
  }),
  http.get('http://localhost/users/me/watched/movies', () => {
    return HttpResponse.json(WatchedMoviesResponseMock);
  }),
  http.get('http://localhost/users/me/watchlist/movies/*', () => {
    return HttpResponse.json(WatchlistMoviesResponseMock);
  }),
  http.get('http://localhost/users/me/watchlist/shows/*', () => {
    return HttpResponse.json(WatchlistShowsResponseMock);
  }),
  http.get('http://localhost/users/me/ratings/movies', () => {
    return HttpResponse.json(RatedMoviesResponseMock);
  }),
  http.get('http://localhost/users/me/ratings/shows', () => {
    return HttpResponse.json(RatedShowsResponseMock);
  }),
  http.get('http://localhost/users/me/ratings/episodes', () => {
    return HttpResponse.json(RatedEpisodesResponseMock);
  }),
  http.get('http://localhost/users/me/history/shows*', () => {
    return HttpResponse.json(ShowActivityHistoryResponseMock);
  }),
  http.get('http://localhost/users/me/history/movies*', () => {
    return HttpResponse.json(MovieActivityHistoryResponseMock);
  }),
  http.get('http://localhost/users/me/history/episodes*', () => {
    return HttpResponse.json(EpisodeActivityHistoryResponseMock);
  }),
  http.get('http://localhost/users/me/following/activities', () => {
    return HttpResponse.json(SocialActivityResponseMock);
  }),
  http.get('http://localhost/users/me/lists/collaborations*', () => {
    return HttpResponse.json(CollaborationListsResponseMock);
  }),
  http.get('http://localhost/users/me/lists*', () => {
    return HttpResponse.json(PersonalListsResponseMock);
  }),
  http.get(
    `http://localhost/users/${UserProfileHarryMappedMock.slug}/lists/${
      assertDefined(SiloListsMappedMock.at(0)).slug
    }`,
    () => {
      return HttpResponse.json(SiloListsResponseMock.at(0));
    },
  ),
  http.get(
    `http://localhost/users/${UserProfileHarryMappedMock.slug}/lists/${
      assertDefined(SiloListsMappedMock.at(0)).slug
    }/items/movie,show*`,
    () => {
      return HttpResponse.json([
        ...ListedShowsResponseMock,
        ...ListedMoviesResponseMock,
      ]);
    },
  ),
  http.get(
    `http://localhost/users/${UserProfileHarryMappedMock.slug}/lists/${
      assertDefined(SiloListsMappedMock.at(0)).slug
    }/items/show*`,
    () => {
      return HttpResponse.json(ListedShowsResponseMock);
    },
  ),
  http.get(
    `http://localhost/users/${UserProfileHarryMappedMock.slug}/lists/${
      assertDefined(HereticListsMappedMock.at(0)).slug
    }/items/movie*`,
    () => {
      return HttpResponse.json(ListedMoviesResponseMock);
    },
  ),
];
