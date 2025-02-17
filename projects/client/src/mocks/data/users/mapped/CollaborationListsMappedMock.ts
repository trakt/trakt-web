import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';

export const CollaborationListsMappedMock: MediaListSummary[] = [
  {
    'description': 'We made this',
    'id': 5678,
    'name': 'Our collaborative list',
    'slug': 'our-list',
    'user': UserProfileHarryMappedMock,
  },
];
