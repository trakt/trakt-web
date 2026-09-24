import type { StreamingSource } from '$lib/requests/models/StreamingSource.ts';
import { describe, expect, it } from 'vitest';
import { buildStreamingServiceOptions } from './buildStreamingServiceOptions.ts';

function source(
  slug: string,
  name = slug,
  logoUrl: HttpsUrl | null = null,
): StreamingSource {
  return {
    source: slug,
    name,
    type: 'subscription',
    isFree: false,
    logoUrl,
    channelLogoUrl: null,
    color: undefined,
  };
}

function purchaseSource(slug: string, name = slug): StreamingSource {
  return { ...source(slug, name), type: 'purchase' };
}

describe('buildStreamingServiceOptions', () => {
  it('should scope favorite services to the selected country', () => {
    const result = buildStreamingServiceOptions({
      countryCode: 'us',
      favorites: ['us-netflix', 'nl-hulu'],
      sourceMap: new Map([
        ['us', [source('netflix', 'Netflix'), source('hulu', 'Hulu')]],
      ]),
    });

    expect(result.top.map((option) => option.source)).toEqual(['netflix']);
    expect(result.hasFavorites).toBe(true);
  });

  it('should support legacy bare favorite source slugs', () => {
    const result = buildStreamingServiceOptions({
      countryCode: 'us',
      favorites: ['netflix'],
      sourceMap: new Map([
        ['us', [source('netflix', 'Netflix')]],
      ]),
    });

    expect(result.top.map((option) => option.source)).toEqual(['netflix']);
  });

  it('should support legacy bare favorite source slugs with hyphens', () => {
    const result = buildStreamingServiceOptions({
      countryCode: 'us',
      favorites: ['prime-video'],
      sourceMap: new Map([
        ['us', [source('prime-video', 'Prime Video')]],
      ]),
    });

    expect(result.top.map((option) => option.source)).toEqual([
      'prime-video',
    ]);
  });

  it('should exclude favorites that are unavailable in the selected country', () => {
    const result = buildStreamingServiceOptions({
      countryCode: 'us',
      favorites: ['us-netflix'],
      sourceMap: new Map([
        ['us', [source('hulu', 'Hulu')]],
      ]),
    });

    expect(result.top.map((option) => option.source)).toEqual(['hulu']);
    expect(result.hasFavorites).toBe(false);
  });

  it('should group well-known variants into one simple option', () => {
    const result = buildStreamingServiceOptions({
      countryCode: 'us',
      favorites: [],
      sourceMap: new Map([
        [
          'us',
          [
            source('netflix', 'Netflix'),
            source('netflix_standard_with_ads', 'Netflix with Ads'),
          ],
        ],
      ]),
    });

    expect(result.top).toEqual([
      expect.objectContaining({
        source: 'netflix',
        slugs: ['netflix', 'netflix_standard_with_ads'],
      }),
    ]);
    expect(result.hasFavorites).toBe(false);
  });

  it('should mark simple service options that have a logo', () => {
    const result = buildStreamingServiceOptions({
      countryCode: 'us',
      favorites: [],
      sourceMap: new Map([
        [
          'us',
          [
            source(
              'netflix',
              'Netflix',
              'https://example.com/netflix.png' as HttpsUrl,
            ),
            source('hulu', 'Hulu'),
          ],
        ],
      ]),
    });

    expect(result.top).toEqual([
      expect.objectContaining({ source: 'netflix', hasLogo: true }),
      expect.objectContaining({ source: 'hulu', hasLogo: false }),
    ]);
  });

  it('should include all selected-country services for advanced options', () => {
    const result = buildStreamingServiceOptions({
      countryCode: 'us',
      favorites: [],
      sourceMap: new Map([
        ['us', [source('hulu', 'Hulu'), source('netflix', 'Netflix')]],
        ['nl', [source('videoland', 'Videoland')]],
      ]),
    });

    expect(result.all.map((option) => option.source)).toEqual([
      'netflix',
      'hulu',
    ]);
  });

  it('should keep rent and buy services out of the simple options', () => {
    const result = buildStreamingServiceOptions({
      countryCode: 'us',
      favorites: [],
      sourceMap: new Map([
        [
          'us',
          [
            purchaseSource('apple_tv', 'Apple TV'),
            source('netflix', 'Netflix'),
            source('apple_tv_plus', 'Apple TV+'),
          ],
        ],
      ]),
    });

    expect(result.top.map((option) => option.source)).toEqual([
      'netflix',
      'apple_tv_plus',
    ]);
  });

  it('should list rent and buy services after streaming services', () => {
    const result = buildStreamingServiceOptions({
      countryCode: 'us',
      favorites: [],
      sourceMap: new Map([
        [
          'us',
          [
            purchaseSource('apple_tv', 'Apple TV'),
            source('netflix', 'Netflix'),
            purchaseSource('amazon_video', 'Amazon Video'),
          ],
        ],
      ]),
    });

    expect(result.all.map((option) => option.source)).toEqual([
      'netflix',
      'apple_tv',
      'amazon_video',
    ]);
  });

  it('should drop rent and buy variants from a grouped simple option', () => {
    const result = buildStreamingServiceOptions({
      countryCode: 'us',
      favorites: [],
      sourceMap: new Map([
        [
          'us',
          [
            purchaseSource('youtube', 'YouTube'),
            source('youtube_free', 'YouTube Free'),
          ],
        ],
      ]),
    });

    expect(result.top).toEqual([
      expect.objectContaining({
        source: 'youtube_free',
        slugs: ['youtube_free'],
      }),
    ]);
  });

  it('should keep services without a known type', () => {
    const result = buildStreamingServiceOptions({
      countryCode: 'us',
      favorites: [],
      sourceMap: new Map([
        ['us', [{ ...source('hulu', 'Hulu'), type: null }]],
      ]),
    });

    expect(result.all.map((option) => option.source)).toEqual(['hulu']);
  });

  it('should mark advanced service options that have a logo', () => {
    const result = buildStreamingServiceOptions({
      countryCode: 'us',
      favorites: [],
      sourceMap: new Map([
        [
          'us',
          [
            source(
              'netflix',
              'Netflix',
              'https://example.com/netflix.png' as HttpsUrl,
            ),
            source('hulu', 'Hulu'),
          ],
        ],
      ]),
    });

    expect(result.all).toEqual([
      expect.objectContaining({ source: 'netflix', hasLogo: true }),
      expect.objectContaining({ source: 'hulu', hasLogo: false }),
    ]);
  });
});
