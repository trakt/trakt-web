import type { UserDigitalLibrary } from '$lib/features/auth/queries/currentUserDigitalLibraryQuery.ts';

export const UserDigitalLibraryMappedMock: UserDigitalLibrary = {
  movies: { '123': ['plex'] },
  shows: { '345': ['plex'] },
  episodes: { '234': ['plex'] },
};
