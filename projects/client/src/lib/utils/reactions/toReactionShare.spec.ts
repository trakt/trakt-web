import { describe, expect, it } from 'vitest';
import { toReactionShare } from './toReactionShare.ts';

describe('util: toReactionShare', () => {
  it('should format a share of the total as a percentage', () => {
    expect(toReactionShare({ count: 3, total: 4, locale: 'en' })).toBe('75%');
  });

  it('should round to the nearest whole percent', () => {
    expect(toReactionShare({ count: 1, total: 3, locale: 'en' })).toBe('33%');
  });

  it('should mark a share too small to round up as under 1%', () => {
    expect(toReactionShare({ count: 1, total: 400, locale: 'en' })).toBe(
      '<1%',
    );
  });

  it('should report 0% without a total', () => {
    expect(toReactionShare({ count: 0, total: 0, locale: 'en' })).toBe('0%');
  });
});
