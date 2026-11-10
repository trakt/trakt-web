import type { MediaSocial } from '$lib/requests/models/MediaSocial.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { mapToSocialActivityEntries } from './mapToSocialActivityEntries.ts';

const social = (overrides: Partial<MediaSocial>): MediaSocial => ({
  key: 'social-1',
  followedAt: new Date('2025-01-01T00:00:00.000Z'),
  user: UserProfileHarryMappedMock,
  ...overrides,
});

describe('util: mapToSocialActivityEntries', () => {
  it('should be empty when the user did nothing', () => {
    expect(mapToSocialActivityEntries(social({}))).toEqual([]);
  });

  it('should list a watch with its play count and minutes', () => {
    const result = mapToSocialActivityEntries(
      social({ watched: { plays: 3, minutesWatched: 120 } }),
    );

    expect(result).toEqual([
      {
        key: 'social-1-watched',
        type: 'watch',
        playCount: 3,
        minutesWatched: 120,
      },
    ]);
  });

  it('should default missing minutes watched to null', () => {
    const [entry] = mapToSocialActivityEntries(
      social({ watched: { plays: 1 } }),
    );

    expect(entry).toMatchObject({ type: 'watch', minutesWatched: null });
  });

  it('should add a rating and a review after the watch, in order', () => {
    const result = mapToSocialActivityEntries(
      social({
        watched: {
          plays: 1,
          rating: { rating: 9 },
          comment: {
            id: 77,
            key: 'comment-77',
            comment: 'Great',
            isSpoiler: false,
            isReview: true,
          },
        },
      }),
    );

    expect(result.map(({ type }) => type)).toEqual([
      'watch',
      'rating',
      'review',
    ]);
    expect(result.at(1)).toMatchObject({ rating: 9 });
    expect(result.at(2)).toMatchObject({
      reviewId: 77,
      author: UserProfileHarryMappedMock.name.full,
    });
  });

  it('should credit the review to the username when the user has no name', () => {
    const result = mapToSocialActivityEntries(
      social({
        user: {
          ...UserProfileHarryMappedMock,
          name: { full: '', first: '', last: '' },
        },
        watched: {
          plays: 1,
          comment: {
            id: 1,
            key: 'comment-1',
            comment: 'Ok',
            isSpoiler: false,
            isReview: true,
          },
        },
      }),
    );

    expect(result.at(1)).toMatchObject({
      author: `@${UserProfileHarryMappedMock.username}`,
    });
  });

  it('should list a watchlisted entry without a watch', () => {
    const result = mapToSocialActivityEntries(
      social({ watchlisted: { listedAt: new Date() } }),
    );

    expect(result).toEqual([
      { key: 'social-1-watchlisted', type: 'watchlist' },
    ]);
  });
});
