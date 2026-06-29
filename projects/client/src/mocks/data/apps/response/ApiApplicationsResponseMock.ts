import type { ApiApplicationResponse } from '$lib/requests/queries/apps/_internal/ApiApplicationResponse.ts';

export const ApiApplicationsResponseMock: ApiApplicationResponse[] = [
  {
    id: 901,
    name: 'Weekend Watchlist Bot',
    description: 'Posts my watchlist to Discord every Friday.',
    client_id: '7f3c9a1e4b2d8c6f0a5e1d9b3c7f2a4e8d6b0c5a',
    client_secret: 'd2e8f6a0c4b1937e5a2c8f0d6b3e1a9c7f4d2b8e6a0c3f1d',
    redirect_uri: 'https://example.com/oauth/callback',
    origins: ['https://example.com'],
    approved: true,
    approved_at: '2024-09-10T12:00:00.000Z',
    scopes: ['public'],
    permissions: {
      scrobble: true,
      checkin: true,
      account_create: false,
    },
    created_at: '2024-08-01T09:30:00.000Z',
  },
  {
    id: 902,
    name: 'Local Test App',
    description: null,
    client_id: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    client_secret: '0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c',
    redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
    origins: [],
    approved: false,
    approved_at: null,
    scopes: ['public'],
    permissions: {
      scrobble: false,
      checkin: false,
      account_create: null,
    },
    created_at: '2025-04-18T14:05:00.000Z',
  },
];
