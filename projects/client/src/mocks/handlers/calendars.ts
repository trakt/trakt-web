import { http, HttpResponse } from 'msw';

import { UpcomingEpisodesResponseMock } from '../data/calendars/response/UpcomingEpisodesResponseMock.ts';
import { UpcomingMoviesResponseMock } from '../data/calendars/response/UpcomingMoviesResponseMock.ts';

export const calendars = [
  http.get(
    'http://localhost/calendars/my/shows/*',
    () => {
      return HttpResponse.json(UpcomingEpisodesResponseMock);
    },
  ),
  http.get(
    'http://localhost/calendars/my/movies/*',
    () => {
      return HttpResponse.json(UpcomingMoviesResponseMock);
    },
  ),
];
