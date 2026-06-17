import type { PlexServerAccountsResponse } from '@trakt/api';

export const serverId = 'abc123server';

export const PlexServerAccountsResponseMock: PlexServerAccountsResponse = {
  accounts: [
    {
      id: 1,
      name: 'Admin',
    },
  ],
  libraries: [
    {
      id: 1,
      uuid: 'lib-movies-uuid',
      type: 'movie',
      title: 'Movies',
      agent: 'tv.plex.agents.movie',
      scanner: 'Plex Movie Scanner',
      selected: true,
      url: 'http://localhost:32400/library/sections/1',
    },
    {
      id: 2,
      uuid: 'lib-shows-uuid',
      type: 'show',
      title: 'TV Shows',
      agent: 'tv.plex.agents.series',
      scanner: 'Plex TV Series Scanner',
      selected: false,
      url: 'http://localhost:32400/library/sections/2',
    },
  ],
};
