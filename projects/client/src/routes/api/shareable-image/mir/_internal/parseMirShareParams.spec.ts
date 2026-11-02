import { describe, expect, it } from 'vitest';
import { parseMirShareParams } from './parseMirShareParams.ts';

const now = new Date('2026-11-02T10:00:00Z');

const parse = (slug: string, query = '') =>
  parseMirShareParams({
    slug,
    searchParams: new URLSearchParams(query),
    now,
  });

describe('util: parseMirShareParams', () => {
  it('should default to the previous month as a cover image', () => {
    expect(parse('sean')).toEqual({
      slug: 'sean',
      year: 2026,
      month: 10,
      shape: 'cover',
      shareType: 'feed',
      isSettled: false,
      settlesAt: new Date('2026-11-08T00:00:00Z'),
      hasExplicitMonth: false,
    });
  });

  it('should roll the default back over the year boundary', () => {
    const result = parseMirShareParams({
      slug: 'sean',
      searchParams: new URLSearchParams(),
      now: new Date('2026-01-15T10:00:00Z'),
    });

    expect(result?.year).toBe(2025);
    expect(result?.month).toBe(12);
  });

  it('should map the legacy shapes to share types', () => {
    expect(parse('sean', 'shape=story')?.shareType).toBe('story');
    expect(parse('sean', 'shape=og')?.shareType).toBe('open-graph');
  });

  it('should only treat a fully specified month as explicit', () => {
    expect(parse('sean', 'year=2026&month=10')?.hasExplicitMonth).toBe(true);
    expect(parse('sean', 'month=10')?.hasExplicitMonth).toBe(false);
  });

  it('should reject the running month', () => {
    expect(parse('sean', 'year=2026&month=11')).toBeNull();
  });

  it('should settle a month a week after it ended', () => {
    const settle = (date: string) =>
      parseMirShareParams({
        slug: 'sean',
        searchParams: new URLSearchParams('year=2026&month=10'),
        now: new Date(date),
      })?.isSettled;

    expect(settle('2026-11-07T23:59:59Z')).toBe(false);
    expect(settle('2026-11-08T00:00:00Z')).toBe(true);
  });

  it('should reject future months', () => {
    expect(parse('sean', 'year=2026&month=12')).toBeNull();
  });

  it('should reject invalid input', () => {
    expect(parse('sean', 'month=13')).toBeNull();
    expect(parse('sean', 'shape=square')).toBeNull();
    expect(parse('..')).toBeNull();
  });

  it('should accept dotted usernames', () => {
    expect(parse('mike.d')).not.toBeNull();
  });
});
