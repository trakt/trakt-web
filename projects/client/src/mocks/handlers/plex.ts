import { http, HttpResponse } from 'msw';

import { PlexSettingsResponseMock } from '../data/plex/response/PlexSettingsResponseMock.ts';

export const plex = [
  http.get('http://localhost/users/settings/plex/', () => {
    return HttpResponse.json(PlexSettingsResponseMock);
  }),
];
