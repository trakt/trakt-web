import { http, HttpResponse } from 'msw';

import {
  PlexServerAccountsResponseMock,
  serverId,
} from '../data/plex/response/PlexServerAccountsResponseMock.ts';
import { PlexServersResponseMock } from '../data/plex/response/PlexServersResponseMock.ts';
import { PlexSettingsResponseMock } from '../data/plex/response/PlexSettingsResponseMock.ts';

export const plex = [
  http.get('http://localhost/users/settings/plex/servers', () => {
    return HttpResponse.json(PlexServersResponseMock);
  }),
  http.get(
    `http://localhost/users/settings/plex/servers/${serverId}`,
    () => {
      return HttpResponse.json(PlexServerAccountsResponseMock);
    },
  ),
  http.get('http://localhost/users/settings/plex/', () => {
    return HttpResponse.json(PlexSettingsResponseMock);
  }),
];
