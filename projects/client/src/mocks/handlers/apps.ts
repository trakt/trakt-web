import { http, HttpResponse } from 'msw';
import { ConnectedAppsResponseMock } from '../data/apps/response/ConnectedAppsResponseMock.ts';

export const apps = [
  http.get(
    'http://localhost/v3/users/me/connected-apps',
    () => HttpResponse.json(ConnectedAppsResponseMock),
  ),
  http.delete(
    'http://localhost/v3/users/me/connected-apps/:id',
    () => new HttpResponse(null, { status: 204 }),
  ),
];
