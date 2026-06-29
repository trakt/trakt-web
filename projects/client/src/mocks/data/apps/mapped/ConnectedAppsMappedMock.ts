import type { ConnectedApp } from '$lib/requests/models/ConnectedApp.ts';

export const ConnectedAppsMappedMock: ConnectedApp[] = [
  {
    id: 12,
    key: 'connected-app-12',
    name: 'Trakt for Apple TV',
    isApproved: true,
    scopes: ['public', 'scrobble'],
    connectedAt: new Date('2024-01-15T10:30:00.000Z'),
    lastUsedAt: new Date('2025-06-01T18:42:00.000Z'),
  },
  {
    id: 47,
    key: 'connected-app-47',
    name: 'My Stats Dashboard',
    isApproved: false,
    scopes: ['public'],
    connectedAt: new Date('2025-03-22T08:00:00.000Z'),
    lastUsedAt: new Date('2025-05-28T21:15:00.000Z'),
  },
];
