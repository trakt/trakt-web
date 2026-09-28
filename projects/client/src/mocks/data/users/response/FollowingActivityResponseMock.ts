import { EpisodeSiloResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloResponseMock.ts';
import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { ShowSiloSeasonsResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloSeasonsResponseMock.ts';
import { UserProfileHarryResponseMock } from '$mocks/data/users/response/UserProfileHarryResponseMock.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';

export const FollowingActivityResponseMock = [
  {
    id: 1,
    action: 'watch',
    method: 'scrobble',
    activity_at: '2026-09-28T14:10:00.000Z',
    user: UserProfileHarryResponseMock,
    type: 'episode',
    show: ShowSiloResponseMock,
    episode: EpisodeSiloResponseMock,
  },
  {
    id: 1,
    action: 'rating',
    rating: 8,
    rated_at: '2026-09-28T11:51:04.000Z',
    activity_at: '2026-09-28T11:51:04.000Z',
    user: UserProfileHarryResponseMock,
    type: 'season',
    show: ShowSiloResponseMock,
    season: assertDefined(ShowSiloSeasonsResponseMock.at(0)),
  },
  {
    id: 9,
    action: 'comment',
    activity_at: '2026-09-28T09:30:00.000Z',
    user: UserProfileHarryResponseMock,
    type: 'movie',
    movie: MovieHereticResponseMock,
    comment: {
      id: 9,
      comment: 'That ending though.',
      gif: {
        url: 'https://static.klipy.com/ii/heretic.gif',
        width: 320,
        height: 180,
      },
      spoiler: false,
      review: false,
      likes: 3,
      replies: 1,
      created_at: '2026-09-28T09:30:00.000Z',
      updated_at: '2026-09-28T09:30:00.000Z',
    },
  },
];
