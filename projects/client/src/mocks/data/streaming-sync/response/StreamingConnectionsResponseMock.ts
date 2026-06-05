import type { YounifyConnection } from '@trakt/api';

export const StreamingConnectionsResponseMock: YounifyConnection[] = [
  {
    id: 'hbomax',
    name: 'HBO Max',
    vip: false,
    color: '#5822b4',
    images: {
      logo: 'walter-r2.trakt.tv/images/younify/hbomax/logo.png',
    },
    connectable: true,
    connected: false,
    active: false,
    profile: null,
    last_synced_at: null,
  },
  {
    id: 'amazon',
    name: 'Prime Video',
    vip: true,
    color: '#00a8e1',
    images: {
      logo: 'walter-r2.trakt.tv/images/younify/amazon/logo.png',
    },
    connectable: true,
    connected: true,
    active: true,
    profile: 'Justin',
    last_synced_at: '2025-05-28T14:51:00.000Z',
  },
  {
    id: 'appletv',
    name: 'Apple TV',
    vip: true,
    color: '#000000',
    images: {
      logo: 'walter-r2.trakt.tv/images/younify/appletv/logo.png',
    },
    connectable: true,
    connected: true,
    active: false,
    profile: null,
    last_synced_at: '2000-01-01T00:00:00.000Z',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    vip: true,
    color: '#e50914',
    images: {
      logo: 'walter-r2.trakt.tv/images/younify/netflix/logo.png',
    },
    connectable: false,
    connected: false,
    active: false,
    profile: null,
    last_synced_at: null,
  },
];
