import { http, HttpResponse } from 'msw';

import { ExtendedUsersResponseMock } from '../data/users/response/ExtendedUserSettingsResponseMock.ts';
import { HistoryEpisodesResponseMock } from '../data/users/response/HistoryEpisodesResponseMock.ts';
import { HistoryMoviesResponseMock } from '../data/users/response/HistoryMoviesResponseMock.ts';
import { HistoryShowsResponseMock } from '../data/users/response/HistoryShowsResponseMock.ts';
import { RatedEpisodesResponseMock } from '../data/users/response/RatedEpisodesResponseMock.ts';
import { RatedMoviesResponseMock } from '../data/users/response/RatedMoviesResponseMock.ts';
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
  http.get('http://localhost/users/me/ratings/episodes', () => {
    return HttpResponse.json(RatedEpisodesResponseMock);
  }),
  http.get('http://localhost/users/me/history/shows*', () => {
    return HttpResponse.json(HistoryShowsResponseMock);
  }),
  http.get('http://localhost/users/me/history/movies*', () => {
    return HttpResponse.json(HistoryMoviesResponseMock);
  }),
  http.get('http://localhost/users/me/history/episodes*', () => {
    return HttpResponse.json(HistoryEpisodesResponseMock);
  }),
  http.get('http://localhost/users/me/following/activities', () => {
    return HttpResponse.json(SocialActivityResponseMock);
  }),
];
