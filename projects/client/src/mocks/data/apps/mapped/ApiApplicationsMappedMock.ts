import type { ApiApplication } from '$lib/requests/models/ApiApplication.ts';

export const ApiApplicationsMappedMock: ApiApplication[] = [
  {
    id: 901,
    key: 'api-application-901',
    name: 'Weekend Watchlist Bot',
    description: 'Posts my watchlist to Discord every Friday.',
    clientId: '7f3c9a1e4b2d8c6f0a5e1d9b3c7f2a4e8d6b0c5a',
    clientSecret: 'd2e8f6a0c4b1937e5a2c8f0d6b3e1a9c7f4d2b8e6a0c3f1d',
    redirectUris: ['https://example.com/oauth/callback'],
    origins: ['https://example.com'],
    isApproved: true,
    approvedAt: new Date('2024-09-10T12:00:00.000Z'),
    scopes: ['public'],
    permissions: {
      canScrobble: true,
      canCheckin: true,
      canCreateAccounts: false,
    },
    createdAt: new Date('2024-08-01T09:30:00.000Z'),
  },
  {
    id: 902,
    key: 'api-application-902',
    name: 'Local Test App',
    description: null,
    clientId: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    clientSecret: '0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c',
    redirectUris: ['urn:ietf:wg:oauth:2.0:oob'],
    origins: [],
    isApproved: false,
    approvedAt: null,
    scopes: ['public'],
    permissions: {
      canScrobble: false,
      canCheckin: false,
      canCreateAccounts: false,
    },
    createdAt: new Date('2025-04-18T14:05:00.000Z'),
  },
];
