import type { StreamingServiceOption } from '$lib/requests/models/StreamingServiceOptions.ts';
import { describe, expect, it } from 'vitest';
import { getGroupedServices } from './getGroupedServices.ts';
import type { NamedServiceOptions } from './models/NamedServiceOptions.ts';
import { StreamingGroup } from './models/StreamingGroup.ts';

const streaming = (source: string): StreamingServiceOption => ({
  link: `https://example.com/${source}`,
  source,
  is4k: false,
  type: 'streaming',
  key: `streaming-${source}`,
});

const free = (source: string): StreamingServiceOption => ({
  link: `https://example.com/${source}`,
  source,
  is4k: false,
  type: 'free',
  key: `free-${source}`,
});

const onDemand = (
  source: string,
  prices: { rent?: number; purchase?: number } = {},
): StreamingServiceOption => ({
  link: `https://example.com/${source}`,
  source,
  is4k: false,
  type: 'on-demand',
  currency: 'usd',
  prices: {
    rent: prices.rent,
    purchase: prices.purchase,
  },
  key: `on-demand-${source}`,
});

function namedServices(
  country: string,
  countryName: string,
  services: StreamingServiceOption[],
): NamedServiceOptions {
  return { country, countryName, services };
}

describe('getGroupedServices', () => {
  const userCountry = 'us';
  const noFavorites: string[] = [];

  it('should return empty groups when there are no services', () => {
    const result = getGroupedServices({
      services: [],
      userCountry,
      favoriteSources: noFavorites,
    });

    expect(result[StreamingGroup.Favorite]).toEqual([]);
    expect(result[StreamingGroup.Subscription]).toEqual([]);
    expect(result[StreamingGroup.Free]).toEqual([]);
    expect(result[StreamingGroup.Purchase]).toEqual([]);
    expect(result[StreamingGroup.Rent]).toEqual([]);
  });

  it('should group streaming services under Subscription', () => {
    const result = getGroupedServices({
      services: [
        namedServices('us', 'United States', [streaming('netflix')]),
      ],
      userCountry,
      favoriteSources: noFavorites,
    });

    expect(result[StreamingGroup.Subscription]).toHaveLength(1);
    expect(result[StreamingGroup.Subscription][0]?.source).toBe('netflix');
    expect(result[StreamingGroup.Free]).toHaveLength(0);
  });

  it('should group free services under Free', () => {
    const result = getGroupedServices({
      services: [
        namedServices('us', 'United States', [free('tubi')]),
      ],
      userCountry,
      favoriteSources: noFavorites,
    });

    expect(result[StreamingGroup.Free]).toHaveLength(1);
    expect(result[StreamingGroup.Free][0]?.source).toBe('tubi');
  });

  it('should group on-demand services under Rent and Purchase', () => {
    const result = getGroupedServices({
      services: [
        namedServices('us', 'United States', [
          onDemand('apple_tv', { rent: 3.99, purchase: 9.99 }),
        ]),
      ],
      userCountry,
      favoriteSources: noFavorites,
    });

    expect(result[StreamingGroup.Rent]).toHaveLength(1);
    expect(result[StreamingGroup.Rent][0]?.source).toBe('apple_tv');
    expect(result[StreamingGroup.Purchase]).toHaveLength(1);
    expect(result[StreamingGroup.Purchase][0]?.source).toBe('apple_tv');
  });

  it('should place rent-only on-demand under Rent only', () => {
    const result = getGroupedServices({
      services: [
        namedServices('us', 'United States', [
          onDemand('vudu', { rent: 3.99 }),
        ]),
      ],
      userCountry,
      favoriteSources: noFavorites,
    });

    expect(result[StreamingGroup.Rent]).toHaveLength(1);
    expect(result[StreamingGroup.Purchase]).toHaveLength(0);
  });

  it('should add favorited services to Favorite group', () => {
    const result = getGroupedServices({
      services: [
        namedServices('us', 'United States', [streaming('netflix')]),
      ],
      userCountry,
      favoriteSources: ['us-netflix'],
    });

    expect(result[StreamingGroup.Favorite]).toHaveLength(1);
    expect(result[StreamingGroup.Favorite][0]?.source).toBe('netflix');
    expect(result[StreamingGroup.Subscription]).toHaveLength(1);
  });

  it('should not add to Favorite when source is not in favorites', () => {
    const result = getGroupedServices({
      services: [
        namedServices('us', 'United States', [streaming('netflix')]),
      ],
      userCountry,
      favoriteSources: ['gb-netflix'],
    });

    expect(result[StreamingGroup.Favorite]).toHaveLength(0);
  });

  it('should group countries under the same source', () => {
    const result = getGroupedServices({
      services: [
        namedServices('us', 'United States', [streaming('netflix')]),
        namedServices('gb', 'United Kingdom', [streaming('netflix')]),
      ],
      userCountry,
      favoriteSources: noFavorites,
    });

    const subscription = result[StreamingGroup.Subscription];
    expect(subscription).toHaveLength(1);
    expect(subscription[0]?.countries).toHaveLength(2);
  });

  it('should prioritize user country in country ordering', () => {
    const result = getGroupedServices({
      services: [
        namedServices('gb', 'United Kingdom', [streaming('netflix')]),
        namedServices('us', 'United States', [streaming('netflix')]),
      ],
      userCountry: 'us',
      favoriteSources: noFavorites,
    });

    const countries = result[StreamingGroup.Subscription][0]?.countries ?? [];
    expect(countries[0]?.country).toBe('us');
  });

  it('should generate unique keys when the same source appears multiple times in the same country', () => {
    const amazon1: StreamingServiceOption = {
      ...streaming('amazon_prime_video'),
      key: 'amazon_prime_video-de-standard',
    };
    const amazon2: StreamingServiceOption = {
      ...streaming('amazon_prime_video'),
      key: 'amazon_prime_video-de-4k',
      is4k: true,
    };

    const result = getGroupedServices({
      services: [
        namedServices('de', 'Germany', [amazon1, amazon2]),
      ],
      userCountry: 'de',
      favoriteSources: noFavorites,
    });

    const subscription = result[StreamingGroup.Subscription];
    expect(subscription).toHaveLength(1);

    const countries = subscription[0]?.countries ?? [];
    expect(countries).toHaveLength(2);

    const keys = countries.map((c) => c.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
