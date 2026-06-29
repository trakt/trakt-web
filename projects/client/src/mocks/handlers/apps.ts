import { http, HttpResponse } from 'msw';
import { ApiApplicationsResponseMock } from '../data/apps/response/ApiApplicationsResponseMock.ts';
import { ConnectedAppsResponseMock } from '../data/apps/response/ConnectedAppsResponseMock.ts';

export const apps = [
  http.get(
    'http://localhost/v3/users/me/connected-apps',
    () => HttpResponse.json(ConnectedAppsResponseMock),
  ),
  http.get(
    'http://localhost/v3/users/me/applications',
    () => HttpResponse.json(ApiApplicationsResponseMock),
  ),
];
