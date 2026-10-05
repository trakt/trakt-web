import { http, HttpResponse } from 'msw';
import { MediaSyncAccountsResponseMock } from '../data/media-sync/response/MediaSyncAccountsResponseMock.ts';
import { MediaSyncConnectionsResponseMock } from '../data/media-sync/response/MediaSyncConnectionsResponseMock.ts';
import { MediaSyncRunsResponseMock } from '../data/media-sync/response/MediaSyncRunsResponseMock.ts';

export const mediaSync = [
  http.get(
    'http://localhost/v3/users/me/sync/connections',
    () => HttpResponse.json(MediaSyncConnectionsResponseMock),
  ),
  http.get(
    'http://localhost/v3/users/me/sync/connections/:id/runs',
    () => HttpResponse.json(MediaSyncRunsResponseMock),
  ),
  http.get(
    'http://localhost/v3/users/me/sync/connections/:id/accounts',
    () => HttpResponse.json(MediaSyncAccountsResponseMock),
  ),
];
