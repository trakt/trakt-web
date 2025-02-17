import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';

export const PersonalListsMappedMock: MediaListSummary[] = [
  {
    'description': 'I made this',
    'id': 5678,
    'name': 'My personal list',
    'slug': 'my-personal-list',
    'user': UserProfileHarryMappedMock,
  },
];
