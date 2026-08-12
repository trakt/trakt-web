import type { UserCollection } from '$lib/features/auth/stores/useCurrentUserCollection.ts';

export const UserCollectionMappedMock: UserCollection = {
  movies: new Set([123]),
  episodes: new Set([234]),
};
