import { http, HttpResponse } from 'msw';

import { WatchNowSourcesResponseMock } from '../data/watchnow/response/WatchNowSourcesResponseMock.ts';

export const watchNow = [
  http.get(
    'http://localhost/watchnow/sources',
    () => {
      return HttpResponse.json(WatchNowSourcesResponseMock);
    },
  ),
];
