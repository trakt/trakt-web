import { describe, expect, it } from 'vitest';
import { isMirImageFresh } from './isMirImageFresh.ts';

const settlesAt = new Date('2026-11-08T00:00:00Z');

const isFresh = (cachedAt: string, now: string) =>
  isMirImageFresh({
    cachedAt: new Date(cachedAt),
    now: new Date(now),
    settlesAt,
  });

describe('util: isMirImageFresh', () => {
  it('should reuse an image rendered within the hour before the month settles', () => {
    expect(isFresh('2026-11-03T10:00:00Z', '2026-11-03T10:59:00Z')).toBe(true);
  });

  it('should rerender an image older than an hour before the month settles', () => {
    expect(isFresh('2026-11-03T10:00:00Z', '2026-11-03T11:00:00Z')).toBe(false);
  });

  it('should rerender once after the month settles', () => {
    expect(isFresh('2026-11-07T23:30:00Z', '2026-11-08T00:10:00Z')).toBe(false);
  });

  it('should keep an image rendered after the month settled', () => {
    expect(isFresh('2026-11-08T00:10:00Z', '2027-03-01T00:00:00Z')).toBe(true);
  });

  it('should rerender when the render date is unknown', () => {
    expect(isFresh('', '2026-11-03T10:00:00Z')).toBe(false);
    expect(isFresh('', '2027-03-01T00:00:00Z')).toBe(false);
  });
});
