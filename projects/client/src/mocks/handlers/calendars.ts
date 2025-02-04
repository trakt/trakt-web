import { http, HttpResponse } from 'msw';

import { UpcomingEpisodesResponseMock } from '../data/calendars/response/UpcomingEpisodesResponseMock.ts';

export const calendars = [
  http.get(
    'http://localhost/calendars/my/shows/*',
    () => {
      return HttpResponse.json(UpcomingEpisodesResponseMock);
    },
  ),
];
