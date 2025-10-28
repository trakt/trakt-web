import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';

export const PersonalListsMappedMock: MediaListSummary[] = [
  {
    'description': 'I made this',
    'id': 5678,
    'key': 'list-5678',
    'name': 'My personal list',
    'slug': 'my-personal-list',
    'user': UserProfileHarryMappedMock,
    'count': 1,
    'posters': [],
    'updatedAt': new Date('2025-02-09T21:39:59.000Z'),
  },
];
