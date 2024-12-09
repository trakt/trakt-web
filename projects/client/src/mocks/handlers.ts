import { http, HttpResponse } from 'msw';

import { ExtendedUsersResponseMock } from './data/users/ExtendedUserSettingsResponseMock.ts';

export const handlers = [
  http.get('/users/settings', () => {
    return HttpResponse.json(ExtendedUsersResponseMock);
  }),
];
