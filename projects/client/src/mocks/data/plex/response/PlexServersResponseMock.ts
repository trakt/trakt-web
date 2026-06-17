import type { PlexServer } from '@trakt/api';

export const PlexServersResponseMock: { servers: PlexServer[] } = {
  servers: [
    {
      id: 'abc123server',
      name: 'Media Server',
      connection_count: 3,
      connection_timeout: 5,
      ports: [32400, 32401],
      owned: true,
      url: 'http://192.168.1.100:32400',
    },
  ],
};
