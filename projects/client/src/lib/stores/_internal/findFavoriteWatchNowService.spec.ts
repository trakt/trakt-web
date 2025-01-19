import type { WatchNowService } from '$lib/requests/models/WatchNowServices.ts';
import { describe, expect, it } from 'vitest';
import { findFavoriteWatchNowService } from './findFavoriteWatchNowService.ts';

describe('findFavoriteWatchNowService', () => {
  it('should return undefined if there are no subscription services', () => {
    expect(findFavoriteWatchNowService({
      services: { streamingServices: [], onDemandServices: [] },
      favorites: ['netflix'],
      countryCode: 'nl',
    })).toBe(undefined);
  });

  it('should return undefined if there are no matching favorite subscriptions', () => {
    expect(findFavoriteWatchNowService({
      services: {
        streamingServices: [{
          link: '',
          source: 'netflix',
          is4k: false,
          type: 'streaming',
        }],
        onDemandServices: [],
      },
      favorites: ['us-netflix'],
      countryCode: 'nl',
    })).toBe(undefined);
  });

  it('should return the matching service', () => {
    const subscription: WatchNowService = {
      link: '',
      source: 'netflix',
      is4k: false,
      type: 'streaming',
    };

    expect(findFavoriteWatchNowService({
      services: {
        streamingServices: [subscription],
        onDemandServices: [],
      },
      favorites: ['nl-netflix'],
      countryCode: 'nl',
    })).toBe(subscription);
  });
});
