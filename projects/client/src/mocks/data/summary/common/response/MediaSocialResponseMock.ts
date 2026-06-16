import {
  type MediaSocialResponseInput,
} from '$lib/requests/queries/media/mediaSocialQuery.ts';
import { UserProfileHarryResponseMock } from '$mocks/data/users/response/UserProfileHarryResponseMock.ts';

const HarryDuBoisResponseMock = {
  username: UserProfileHarryResponseMock.username,
  private: UserProfileHarryResponseMock.private,
  deleted: UserProfileHarryResponseMock.deleted,
  name: UserProfileHarryResponseMock.name,
  vip: UserProfileHarryResponseMock.vip,
  vip_ep: UserProfileHarryResponseMock.vip_ep,
  director: UserProfileHarryResponseMock.director,
  ids: UserProfileHarryResponseMock.ids,
  images: {
    avatar: {
      full: UserProfileHarryResponseMock.images?.avatar.full,
    },
  },
};

const KimKitsuragiResponseMock = {
  ...HarryDuBoisResponseMock,
  username: 'kim_kitsuragi',
  name: 'Kim Kitsuragi',
  vip: false,
  ids: {
    slug: 'kim_kitsuragi',
    trakt: 57,
  },
  images: {
    avatar: {
      full: 'https://avatar.test/kim.jpg',
    },
  },
};

export const MediaSocialResponseMock: MediaSocialResponseInput = [
  {
    followed_at: '2025-01-04T18:22:10.000Z',
    user: HarryDuBoisResponseMock,
    watched: {
      plays: 2,
      last_watched_at: '2026-06-01T20:15:00.000Z',
      last_updated_at: '2026-06-01T20:16:00.000Z',
      rating: {
        rating: 8,
        rated_at: '2026-06-01T20:20:00.000Z',
      },
      comment: {
        ids: { trakt: 1337 },
        comment:
          'This all could have been avoided if he just started a podcast like a normal dude',
        spoiler: false,
        review: false,
        created_at: '2026-06-01T20:25:00.000Z',
        updated_at: '2026-06-01T20:25:00.000Z',
      },
    },
  },
  {
    followed_at: '2025-01-05T19:22:10.000Z',
    user: KimKitsuragiResponseMock,
    watchlisted: {
      listed_at: '2026-05-20T12:00:00.000Z',
    },
  },
];
