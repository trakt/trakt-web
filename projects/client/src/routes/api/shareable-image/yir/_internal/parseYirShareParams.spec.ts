import { describe, expect, it } from 'vitest';
import { parseYirShareParams } from './parseYirShareParams.ts';

const now = new Date('2026-12-02T10:00:00Z');

const parse = (slug: string, query = '', at = now) =>
  parseYirShareParams({
    slug,
    searchParams: new URLSearchParams(query),
    now: at,
  });

describe('util: parseYirShareParams', () => {
  it('should default to the current review year as a cover image', () => {
    expect(parse('sean')).toEqual({
      slug: 'sean',
      year: 2026,
      shape: 'cover',
      shareType: 'feed',
      isSettled: false,
      settlesAt: new Date('2027-01-08T00:00:00Z'),
      hasExplicitYear: false,
    });
  });

  it('should keep the previous year early in the next year', () => {
    expect(parse('sean', '', new Date('2027-02-10T10:00:00Z'))).toMatchObject({
      year: 2026,
      isSettled: true,
    });
  });

  it('should parse an explicit year and shape', () => {
    expect(parse('sean', 'year=2026&shape=story')).toMatchObject({
      year: 2026,
      shape: 'story',
      shareType: 'story',
      hasExplicitYear: true,
    });
  });

  it('should reject years without personas', () => {
    expect(parse('sean', 'year=2025')).toBeNull();
  });

  it('should reject future years', () => {
    expect(parse('sean', 'year=2027')).toBeNull();
  });

  it('should reject unknown shapes and invalid slugs', () => {
    expect(parse('sean', 'shape=square')).toBeNull();
    expect(parse('../sean')).toBeNull();
  });
});
