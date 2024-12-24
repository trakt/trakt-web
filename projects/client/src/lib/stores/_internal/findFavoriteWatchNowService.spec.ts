import { describe, expect, it } from 'vitest';
import { findFavoriteWatchNowService } from './findFavoriteWatchNowService.ts';

describe('findFavoriteWatchNowService', () => {
  it('should return undefined if there are no subscription services', () => {
    expect(findFavoriteWatchNowService({
      services: { subscriptions: [] },
      favorites: ['nl-netflix'],
    })).toBe(undefined);
  });

  it('should return undefined if there are no matching favorite subscriptions', () => {
    expect(findFavoriteWatchNowService({
      services: {
        subscriptions: [{ link: '', source: 'us-netflix', is4k: false }],
      },
      favorites: ['nl-netflix'],
    })).toBe(undefined);
  });

  it('should return the matching service', () => {
    const subscription = { link: '', source: 'nl-netflix', is4k: false };

    expect(findFavoriteWatchNowService({
      services: {
        subscriptions: [subscription],
      },
      favorites: ['nl-netflix'],
    })).toBe(subscription);
  });
});
