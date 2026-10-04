import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { describe, expect, it } from 'vitest';
import { stampShareDate } from './stampShareDate.ts';

const ORIGIN = 'https://app.trakt.tv';
const DATE = new Date('2026-10-04T18:30:00Z');

describe('util: stampShareDate', () => {
  it('should add the day to trending share images', () => {
    const url = new URL(
      UrlBuilder.api.trendingShareableImage('show').openGraph(),
      ORIGIN,
    );

    const stamped = stampShareDate({ url, date: DATE });

    expect(stamped.searchParams.get('date')).toBe('2026-10-04');
    expect(stamped.searchParams.get('type')).toBe('show');
  });

  it('should leave other images untouched', () => {
    const url = new URL('https://media.trakt.tv/poster.webp');

    expect(stampShareDate({ url, date: DATE }).href).toBe(url.href);
  });
});
