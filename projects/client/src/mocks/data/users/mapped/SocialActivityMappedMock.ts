import type { SocialActivity } from '$lib/requests/models/SocialActivity.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';

export const SocialActivityMappedMock: SocialActivity[] = [
  {
    id: 1,
    activityAt: new Date('2025-01-31T23:12:41.000Z'),
    users: [UserProfileHarryMappedMock],
    type: 'movie',
    movie: MovieHereticMappedMock,
  },
  {
    id: 2,
    activityAt: new Date('2025-01-31T23:12:41.000Z'),
    users: [UserProfileHarryMappedMock],
    type: 'episode',
    episode: EpisodeSiloMappedMock,
    show: ShowSiloMappedMock,
  },
];
