import { http, HttpResponse } from 'msw';

import { AuthResponseMock } from '../data/auth/AuthResponseMock.ts';

export const auth = [
  http.post(`${TRAKT_TARGET_ENVIRONMENT}/oauth/token`, () => {
    return HttpResponse.json(AuthResponseMock);
  }),
];
