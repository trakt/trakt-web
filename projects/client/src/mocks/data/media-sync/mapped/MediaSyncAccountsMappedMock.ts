import type { MediaSyncAccount } from '$lib/requests/media-sync/models/MediaSyncAccount.ts';

export const MediaSyncAccountsMappedMock: MediaSyncAccount[] = [
  {
    accountId: '1',
    name: 'Owner',
    avatarUrl: 'https://plex.tv/users/mock-owner/avatar',
    owner: true,
    selected: false,
  },
  {
    accountId: '200',
    name: 'Kid',
    avatarUrl: null,
    owner: false,
    selected: true,
  },
];
