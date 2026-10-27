import type { MediaSyncConnection } from '$lib/requests/media-sync/models/MediaSyncConnection.ts';

export const MediaSyncConnectionsMappedMock: MediaSyncConnection[] = [
  {
    id: 7,
    provider: 'plex',
    status: 'active',
    serverId: 'server-mock-1',
    serverName: 'Living Room',
    webhookUrl: 'https://sync.trakt.tv/webhooks/plex/mock-secret',
    accountName: 'mock-user',
    feeds: ['history', 'ratings', 'collection', 'watchlist'],
    libraries: [
      {
        id: 11,
        externalId: '1',
        kind: 'movies',
        title: 'Movies',
        enabled: true,
        itemCount: 520,
      },
      {
        id: 12,
        externalId: '2',
        kind: 'shows',
        title: 'TV Shows',
        enabled: false,
        itemCount: 48,
      },
    ],
    failureCount: 0,
    lastFailureKind: null,
    collectionLimitReached: false,
    lastSyncedAt: new Date('2026-10-05T09:00:00.000Z'),
    nextSyncAt: new Date('2026-10-05T10:00:00.000Z'),
  },
  {
    id: 8,
    provider: 'jellyfin',
    status: 'active',
    serverId: 'server-mock-2',
    serverName: 'Den',
    webhookUrl:
      'https://sync.trakt.tv/webhooks/jellyfin/0123456789abcdef0123456789abcdef',
    accountName: 'mock-user',
    feeds: ['history'],
    libraries: [],
    failureCount: 0,
    lastFailureKind: null,
    collectionLimitReached: false,
    lastSyncedAt: new Date('2026-10-05T09:00:00.000Z'),
    nextSyncAt: new Date('2026-10-05T10:00:00.000Z'),
  },
];
