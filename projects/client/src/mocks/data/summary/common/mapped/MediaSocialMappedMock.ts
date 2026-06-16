import type { MediaSocial } from '$lib/requests/models/MediaSocial.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';

const KimKitsuragiMappedMock = {
  ...UserProfileHarryMappedMock,
  id: 57,
  key: 'user-57',
  username: 'kim_kitsuragi',
  name: {
    first: 'Kim',
    last: 'Kitsuragi',
    full: 'Kim Kitsuragi',
  },
  slug: 'kim_kitsuragi',
  avatar: {
    url: 'https://avatar.test/kim.jpg',
  },
  isVip: false,
};

export const MediaSocialMappedMock: MediaSocial[] = [
  {
    key: 'media-social-41152',
    followedAt: new Date('2025-01-04T18:22:10.000Z'),
    user: {
      ...UserProfileHarryMappedMock,
      about: null,
      location: null,
    },
    watched: {
      plays: 2,
      lastWatchedAt: new Date('2026-06-01T20:15:00.000Z'),
      lastUpdatedAt: new Date('2026-06-01T20:16:00.000Z'),
      rating: {
        rating: 8,
        ratedAt: new Date('2026-06-01T20:20:00.000Z'),
      },
      comment: {
        id: 1337,
        key: 'comment-1337',
        comment:
          'This all could have been avoided if he just started a podcast like a normal dude',
        isSpoiler: false,
        isReview: false,
        createdAt: new Date('2026-06-01T20:25:00.000Z'),
        updatedAt: new Date('2026-06-01T20:25:00.000Z'),
      },
    },
  },
  {
    key: 'media-social-57',
    followedAt: new Date('2025-01-05T19:22:10.000Z'),
    user: {
      ...KimKitsuragiMappedMock,
      about: null,
      location: null,
    },
    watchlisted: {
      listedAt: new Date('2026-05-20T12:00:00.000Z'),
    },
  },
];
