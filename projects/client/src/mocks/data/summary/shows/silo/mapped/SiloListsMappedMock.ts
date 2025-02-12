import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';

export const SiloListsMappedMock: MediaListSummary[] = [
  {
    'description': 'There is no escape from this list',
    'id': 5678,
    'name': 'Silos',
    'slug': 'silos',
    'user': UserProfileHarryMappedMock,
  },
];
