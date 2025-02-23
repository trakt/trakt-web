import type { StreamOnDemand } from '$lib/requests/models/StreamingServiceOptions.ts';
import { describe, expect, it } from 'vitest';
import { getMediaCost } from './getMediaCost.ts';

describe('getMediaCost', () => {
  it('should return an empty string if there are no rent or purchase prices', () => {
    const onDemandService: StreamOnDemand = {
      link: 'https://example.com',
      source: 'source',
      is4k: false,
      currency: 'usd',
      prices: {},
      type: 'on-demand',
    };

    expect(getMediaCost(onDemandService)).toEqual('');
  });

  it('should prioritize the rent price over the purchase price', () => {
    const onDemandService: StreamOnDemand = {
      link: 'https://example.com',
      source: 'source',
      is4k: false,
      currency: 'usd',
      prices: { rent: 3.99, purchase: 9.99 },
      type: 'on-demand',
    };

    expect(getMediaCost(onDemandService)).toEqual('$3.99');
  });

  it('should get the purchase price if there is no rent price', () => {
    const onDemandService: StreamOnDemand = {
      link: 'https://example.com',
      source: 'source',
      is4k: false,
      currency: 'usd',
      prices: { purchase: 9.99 },
      type: 'on-demand',
    };

    expect(getMediaCost(onDemandService)).toEqual('$9.99');
  });
});
