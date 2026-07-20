import { http, HttpResponse } from 'msw';
import { UserLimitsResponseMock } from '../data/vip/response/UserLimitsResponseMock.ts';

export const vip = [
  http.get(
    'http://localhost/v3/users/me/usage',
    () => HttpResponse.json(UserLimitsResponseMock),
  ),
];
