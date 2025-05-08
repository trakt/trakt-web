import type { NowPlayingItem } from '$lib/requests/models/NowPlayingItem.ts';
import { MovieHereticMappedMock } from '../../summary/movies/heretic/mapped/MovieHereticMappedMock.ts';

export const UserWatchingMappedMock: NowPlayingItem = {
  startedAt: new Date('2023-10-01T12:00:00.000Z'),
  expiresAt: new Date('2023-10-01T13:00:00.000Z'),
  media: MovieHereticMappedMock,
  type: 'movie',
};
