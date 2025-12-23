import type { WatchNowServiceResponse } from '@trakt/api';
import { describe, expect, it } from 'vitest';
import { sortStreamingServices } from './sortStreamingServices.ts';

describe('sortStreamingServices', () => {
  const getSource = (sourceName: string): WatchNowServiceResponse => ({
    source: sourceName,
    link: 'example.com',
    uhd: false,
    currency: 'usd',
    prices: { rent: '3.99', purchase: '9.99' },
  });

  it('should sort the most popular services first and sort the rest alphabetically', () => {
    const sources = [
      getSource('source-a'),
      getSource('netflix'),
      getSource('source-z'),
      getSource('apple_tv_plus'),
      getSource('source-h'),
      getSource('disney_plus'),
      getSource('source-c'),
      getSource('amazon_prime_video'),
      getSource('source-k'),
      getSource('hbo_max'),
      getSource('source-y'),
      getSource('apple_tv'),
      getSource('source-w'),
    ];

    const sortedSources = sortStreamingServices(sources);

    expect(sortedSources.map((source) => source.source)).toEqual([
      'netflix',
      'apple_tv_plus',
      'apple_tv',
      'disney_plus',
      'amazon_prime_video',
      'hbo_max',
      'source-a',
      'source-c',
      'source-h',
      'source-k',
      'source-w',
      'source-y',
      'source-z',
    ]);
  });
});
