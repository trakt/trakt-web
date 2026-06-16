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
  it('sorts by rating, play count, watchlist, and latest activity date', () => {
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
      'rated-low-plays',
      'watched-high-plays',
      'watched-low-plays',
      'watchlisted-recent',
      'watchlisted-old',
    ]);
    expect(entries.at(0)?.key).toBe('watchlisted-old');
  });
});
