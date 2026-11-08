import { MAX_DATE } from '$lib/utils/constants.ts';
import { describe, expect, it } from 'vitest';
import { toEpisodeReleaseDate } from './toEpisodeReleaseDate.ts';

describe('toEpisodeReleaseDate', () => {
  it('should prefer the broadcast time when the streaming date is the same release day', () => {
    const result = toEpisodeReleaseDate({
      firstAired: '2026-11-04T02:00:00.000Z',
      released: '2026-11-03',
    });

    expect(result.toISOString()).toBe('2026-11-04T02:00:00.000Z');
  });

  it('should keep a streaming date that falls on an earlier day', () => {
    const result = toEpisodeReleaseDate({
      firstAired: '2026-11-05T02:00:00.000Z',
      released: '2026-11-03',
    });

    expect(result.toISOString()).toBe('2026-11-03T12:00:00.000Z');
  });

  it('should keep an exact streaming time that comes before the broadcast', () => {
    const result = toEpisodeReleaseDate({
      firstAired: '2026-11-04T02:00:00.000Z',
      released: '2026-11-03T08:00:00.000Z',
    });

    expect(result.toISOString()).toBe('2026-11-03T08:00:00.000Z');
  });

  it('should use the broadcast time when it comes first', () => {
    const result = toEpisodeReleaseDate({
      firstAired: '2026-11-04T02:00:00.000Z',
      released: '2026-11-06',
    });

    expect(result.toISOString()).toBe('2026-11-04T02:00:00.000Z');
  });

  it('should fall back to the streaming date without a broadcast', () => {
    const result = toEpisodeReleaseDate({
      firstAired: null,
      released: '2026-11-03',
    });

    expect(result.toISOString()).toBe('2026-11-03T12:00:00.000Z');
  });

  it('should return the max date when both are missing', () => {
    expect(toEpisodeReleaseDate({ firstAired: null, released: null })).toEqual(
      MAX_DATE,
    );
  });
});
