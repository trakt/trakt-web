import { EpisodeSiloResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloResponseMock.ts';
import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { UserProfileHarryResponseMock } from '$mocks/data/users/response/UserProfileHarryResponseMock.ts';
import type { SocialActivityResponse } from '@trakt/api';

export const SocialActivityResponseMock: SocialActivityResponse[] = [{
  id: 1,
  type: 'movie',
  action: 'watch',
  activity_at: '2025-01-31T23:12:41.000Z',
  user: UserProfileHarryResponseMock,
  movie: MovieHereticResponseMock,
}, {
  id: 2,
  type: 'episode',
  action: 'scrobble',
  activity_at: '2025-01-31T23:12:41.000Z',
  user: UserProfileHarryResponseMock,
  show: ShowSiloResponseMock,
  episode: EpisodeSiloResponseMock,
}];
