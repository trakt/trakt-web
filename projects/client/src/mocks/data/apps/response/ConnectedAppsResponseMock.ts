import type { ConnectedAppResponse } from '$lib/requests/queries/apps/_internal/ConnectedAppResponse.ts';

export const ConnectedAppsResponseMock: ConnectedAppResponse[] = [
  {
    id: 12,
    name: 'Trakt for Apple TV',
    approved: true,
    scopes: ['public', 'scrobble'],
    connected_at: '2024-01-15T10:30:00.000Z',
    last_used_at: '2025-06-01T18:42:00.000Z',
  },
  {
    id: 47,
    name: 'My Stats Dashboard',
    approved: false,
    scopes: ['public'],
    connected_at: '2025-03-22T08:00:00.000Z',
    last_used_at: '2025-05-28T21:15:00.000Z',
  },
];
