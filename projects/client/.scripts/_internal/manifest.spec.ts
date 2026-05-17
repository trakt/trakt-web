import { describe, expect, it } from 'vitest';
import { manifestKeyFor, manifestKeyToDate } from './manifest.ts';

describe('manifestKeyFor', () => {
  it('builds an ISO-prefixed key sortable lexicographically by time', () => {
    const earlier = manifestKeyFor(
      'abc1234',
      new Date('2026-01-01T00:00:00Z'),
    );
    const later = manifestKeyFor('def5678', new Date('2026-01-02T00:00:00Z'));
    expect(earlier < later).toBe(true);
    expect(earlier).toMatch(
      /^releases\/2026-01-01T00-00-00-000Z_abc1234\.json$/,
    );
  });
});

describe('manifestKeyToDate', () => {
  it('round-trips through manifestKeyFor', () => {
    const original = new Date('2026-05-17T14:30:45.123Z');
    const key = manifestKeyFor('abc1234', original);
    const parsed = manifestKeyToDate(key);
    expect(parsed?.toISOString()).toBe(original.toISOString());
  });

  it('returns null for malformed keys', () => {
    expect(manifestKeyToDate('releases/garbage.json')).toBeNull();
    expect(manifestKeyToDate('releases/2026-99-99T99-99-99-999Z_x.json'))
      .toBeNull();
    expect(manifestKeyToDate('something-else.json')).toBeNull();
  });
});
