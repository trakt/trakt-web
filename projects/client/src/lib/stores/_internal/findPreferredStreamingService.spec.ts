import { describe, expect, it } from 'vitest';
import type { StreamNow } from '../../requests/models/StreamingServiceOptions.ts';
import { findPreferredStreamingService } from './findPreferredStreamingService.ts';

describe('findPreferredStreamingService', () => {
  it('should return undefined if there are no subscription services', () => {
    expect(findPreferredStreamingService({
      services: { streaming: [], onDemand: [] },
      favorites: ['netflix'],
      countryCode: 'nl',
    })).toBe(undefined);
  });

  it('should return the first available if there are no matching favorite subscriptions', () => {
    expect(findPreferredStreamingService({
      services: {
        streaming: [{
          link: 'https://www.netflix.com/',
          source: 'netflix',
          is4k: false,
          type: 'streaming',
          key: 'streaming-netflix',
        }],
        onDemand: [],
      },
      favorites: ['us-netflix'],
      countryCode: 'nl',
    })).toStrictEqual({
      'is4k': false,
      'link': 'https://www.netflix.com/',
      'source': 'netflix',
      'type': 'streaming',
      'key': 'streaming-netflix',
    });
  });

  it('should return the matching service', () => {
    const subscription: StreamNow = {
      link: 'https://www.netflix.com/',
      source: 'netflix',
      is4k: false,
      type: 'streaming',
      key: 'streaming-netflix',
    };

    expect(findPreferredStreamingService({
      services: {
        streaming: [subscription],
        onDemand: [],
      },
      favorites: ['nl-netflix'],
      countryCode: 'nl',
    })).toBe(subscription);
  });
});
