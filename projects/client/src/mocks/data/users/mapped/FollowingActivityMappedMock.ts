import type { FollowingActivity } from '$lib/requests/models/FollowingActivity.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloSeasonsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonsMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';

export const FollowingActivityMappedMock: FollowingActivity[] = [
  {
    key: 'watch:1',
    activityAt: new Date('2026-09-28T14:10:00.000Z'),
    user: UserProfileHarryMappedMock,
    target: {
      type: 'episode',
      show: ShowSiloMappedMock,
      episode: EpisodeSiloMappedMock,
    },
    detail: { action: 'watch' },
  },
  {
    key: 'rating:1',
    activityAt: new Date('2026-09-28T11:51:04.000Z'),
    user: UserProfileHarryMappedMock,
    target: {
      type: 'season',
      show: ShowSiloMappedMock,
      season: assertDefined(ShowSiloSeasonsMappedMock.at(0)),
    },
    detail: { action: 'rating', rating: 8 },
  },
  {
    key: 'comment:9',
    activityAt: new Date('2026-09-28T09:30:00.000Z'),
    user: UserProfileHarryMappedMock,
    target: { type: 'movie', movie: MovieHereticMappedMock },
    detail: {
      action: 'comment',
      comment: {
        id: 9,
        text: 'That ending though.',
        gif: {
          url: 'https://static.klipy.com/ii/heretic.gif',
          size: { width: 320, height: 180 },
        },
        isSpoiler: false,
        isReview: false,
        likeCount: 3,
        replyCount: 1,
      },
    },
  },
];
