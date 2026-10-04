import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { describe, expect, it } from 'vitest';
import { isTrendingShareImage } from './isTrendingShareImage.ts';

const ORIGIN = 'https://app.trakt.tv';

describe('util: isTrendingShareImage', () => {
  it('should match the trending share image', () => {
    const url = new URL(
      UrlBuilder.api.trendingShareableImage('movie').openGraph(),
      ORIGIN,
    );

    expect(isTrendingShareImage(url)).toBe(true);
  });

  it('should not match other images', () => {
    const url = new URL(
      UrlBuilder.api.shareableImage('movie', 'heretic-2024').openGraph(),
      ORIGIN,
    );

    expect(isTrendingShareImage(url)).toBe(false);
  });
});
