import type { MediaSocial } from '$lib/requests/models/MediaSocial.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { sortMediaSocialEntries } from './sortMediaSocialEntries.ts';

function socialEntry(
  key: string,
  overrides: Omit<Partial<MediaSocial>, 'key' | 'user'>,
): MediaSocial {
  return {
    key,
    followedAt: new Date('2026-01-01T00:00:00.000Z'),
    user: {
      ...UserProfileHarryMappedMock,
      id: Number(key.replace(/\D/g, '')),
      key: `user-${key}`,
      username: key,
      slug: key,
    },
    ...overrides,
  };
}

describe('sortMediaSocialEntries', () => {
  it('falls back to play count, then watchlist, then latest activity date', () => {
    const ratedLowPlays = socialEntry('rated-low-plays', {
      watched: {
        plays: 1,
        rating: {
          rating: 8,
          ratedAt: new Date('2026-01-01T00:00:00.000Z'),
        },
      },
    });
    const watchedHighPlays = socialEntry('watched-high-plays', {
      watched: {
        plays: 9,
        lastWatchedAt: new Date('2026-05-01T00:00:00.000Z'),
      },
    });
    const watchedLowPlays = socialEntry('watched-low-plays', {
      watched: {
        plays: 2,
        lastWatchedAt: new Date('2026-06-01T00:00:00.000Z'),
      },
    });
    const watchlistedRecent = socialEntry('watchlisted-recent', {
      watchlisted: {
        listedAt: new Date('2026-06-01T00:00:00.000Z'),
      },
    });
    const watchlistedOld = socialEntry('watchlisted-old', {
      watchlisted: {
        listedAt: new Date('2026-01-01T00:00:00.000Z'),
      },
    });

    const entries = [
      watchlistedOld,
      watchedLowPlays,
      watchlistedRecent,
      watchedHighPlays,
      ratedLowPlays,
    ];

    const sorted = sortMediaSocialEntries(entries);

    expect(sorted.map((entry) => entry.key)).toEqual([
      'watched-high-plays',
      'watched-low-plays',
      'rated-low-plays',
      'watchlisted-recent',
      'watchlisted-old',
    ]);
    expect(entries.at(0)?.key).toBe('watchlisted-old');
  });

  it('ranks entries with plays on top, by watch time descending', () => {
    const lowMinutes = socialEntry('low-minutes', {
      watched: { plays: 2, minutesWatched: 100 },
    });
    const highMinutes = socialEntry('high-minutes', {
      watched: { plays: 1, minutesWatched: 300 },
    });
    const ratedMidMinutes = socialEntry('rated-mid-minutes', {
      watched: {
        plays: 5,
        minutesWatched: 200,
        rating: { rating: 9, ratedAt: new Date('2026-01-01T00:00:00.000Z') },
      },
    });
    const watchlisted = socialEntry('watchlisted', {
      watchlisted: { listedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    const sorted = sortMediaSocialEntries([
      lowMinutes,
      watchlisted,
      ratedMidMinutes,
      highMinutes,
    ]);

    expect(sorted.map((entry) => entry.key)).toEqual([
      'high-minutes',
      'rated-mid-minutes',
      'low-minutes',
      'watchlisted',
    ]);
  });

  it('ranks a review above a watchlist add at equal watch time', () => {
    const ratedAt = new Date('2026-01-01T00:00:00.000Z');
    const watchedWatchlisted = socialEntry('watched-watchlisted', {
      watched: { plays: 1, minutesWatched: 157 },
      watchlisted: { listedAt: ratedAt },
    });
    const watchedReviewed = socialEntry('watched-reviewed', {
      watched: {
        plays: 1,
        minutesWatched: 157,
        comment: {
          id: 1,
          key: 'comment-1',
          comment: 'nice',
          isSpoiler: false,
          isReview: true,
          createdAt: ratedAt,
          updatedAt: ratedAt,
        },
      },
    });

    const sorted = sortMediaSocialEntries([
      watchedWatchlisted,
      watchedReviewed,
    ]);

    expect(sorted.map((entry) => entry.key)).toEqual([
      'watched-reviewed',
      'watched-watchlisted',
    ]);
  });

  it('breaks equal watch time ties by weighted activity score', () => {
    const ratedAt = new Date('2026-01-01T00:00:00.000Z');
    const watchedOnly = socialEntry('watched-only', {
      watched: { plays: 1, minutesWatched: 157 },
    });
    const watchedReviewed = socialEntry('watched-reviewed', {
      watched: {
        plays: 1,
        minutesWatched: 157,
        comment: {
          id: 1,
          key: 'comment-1',
          comment: 'nice',
          isSpoiler: false,
          isReview: true,
          createdAt: ratedAt,
          updatedAt: ratedAt,
        },
      },
    });
    const watchedWatchlistedRated = socialEntry('watched-watchlisted-rated', {
      watched: {
        plays: 1,
        minutesWatched: 157,
        rating: { rating: 5, ratedAt },
      },
      watchlisted: { listedAt: ratedAt },
    });

    const sorted = sortMediaSocialEntries([
      watchedOnly,
      watchedReviewed,
      watchedWatchlistedRated,
    ]);

    expect(sorted.map((entry) => entry.key)).toEqual([
      'watched-watchlisted-rated',
      'watched-reviewed',
      'watched-only',
    ]);
  });
});
