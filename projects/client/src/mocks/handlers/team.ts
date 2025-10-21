import { http, HttpResponse } from 'msw';

import { TraktTeamResponseMock } from '../data/team/response/TraktTeamResponseMock.ts';

export const team = [
  http.get(
    'http://localhost/team',
    () => {
      return HttpResponse.json(TraktTeamResponseMock);
    },
  ),
];
