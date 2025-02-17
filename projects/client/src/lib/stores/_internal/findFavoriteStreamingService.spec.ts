import { describe, expect, it } from 'vitest';
import type { StreamNow } from '../../requests/models/StreamingServiceOptions.ts';
import { findFavoriteStreamingService } from './findFavoriteStreamingService.ts';

describe('findFavoriteStreamingService', () => {
  it('should return undefined if there are no subscription services', () => {
    expect(findFavoriteStreamingService({
      services: { streaming: [], onDemand: [] },
      favorites: ['netflix'],
      countryCode: 'nl',
    })).toBe(undefined);
  });

  it('should return undefined if there are no matching favorite subscriptions', () => {
    expect(findFavoriteStreamingService({
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
    const subscription: StreamNow = {
      link: 'https://www.netflix.com/',
      source: 'netflix',
      is4k: false,
      type: 'streaming',
    };

    expect(findFavoriteStreamingService({
      services: {
        streaming: [subscription],
        onDemand: [],
      },
      favorites: ['nl-netflix'],
      countryCode: 'nl',
    })).toBe(subscription);
  });
});
