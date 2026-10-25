import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';

export const HereticListsMappedMock: MediaListSummary[] = [
  {
    description: 'This list contains Heretic',
    id: 1234,
    key: 'list-1234',
    likeCount: 4161,
    name: 'Heretics only',
    slug: 'heretics-only',
    user: UserProfileHarryMappedMock,
    count: 1,
    posters: [],
    createdAt: new Date('2018-07-29T10:16:22.000Z'),
    updatedAt: new Date('2025-02-09T21:39:59.000Z'),
    sortBy: 'added',
    sortHow: 'asc',
    type: 'personal',
    privacy: 'public',
    staleOrigin: null,
    convertedTo: null,
  },
];
