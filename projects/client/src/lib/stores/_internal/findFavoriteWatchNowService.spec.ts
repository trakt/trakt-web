import type { WatchNowStreaming } from '$lib/requests/models/WatchNowServices.ts';
import { describe, expect, it } from 'vitest';
import { findFavoriteWatchNowService } from './findFavoriteWatchNowService.ts';

describe('findFavoriteWatchNowService', () => {
  it('should return undefined if there are no subscription services', () => {
    expect(findFavoriteWatchNowService({
      services: { streaming: [], onDemand: [] },
      favorites: ['netflix'],
      countryCode: 'nl',
    })).toBe(undefined);
  });

  it('should return undefined if there are no matching favorite subscriptions', () => {
    expect(findFavoriteWatchNowService({
      services: {
        streaming: [{
          link: 'https://www.netflix.com/',
          source: 'netflix',
          is4k: false,
          type: 'streaming',
        }],
        onDemand: [],
      },
      favorites: ['us-netflix'],
      countryCode: 'nl',
    })).toBe(undefined);
  });

  it('should return the matching service', () => {
    const subscription: WatchNowStreaming = {
      link: 'https://www.netflix.com/',
      source: 'netflix',
      is4k: false,
      type: 'streaming',
    };

    expect(findFavoriteWatchNowService({
      services: {
        streaming: [subscription],
        onDemand: [],
      },
      favorites: ['nl-netflix'],
      countryCode: 'nl',
    })).toBe(subscription);
  });
});
