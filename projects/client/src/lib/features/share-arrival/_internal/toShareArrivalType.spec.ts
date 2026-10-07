import { describe, expect, it } from 'vitest';
import { toShareArrivalType } from './toShareArrivalType.ts';

describe('toShareArrivalType', () => {
  it('will name the shareable item type from the route template', () => {
    expect(toShareArrivalType('/movies/[slug]')).toBe('movie');
    expect(
      toShareArrivalType('/shows/[slug]/seasons/[season]/episodes/[episode]'),
    ).toBe('episode');
    expect(toShareArrivalType('/users/[user]/lists/[list]')).toBe('list');
  });

  it('will fall back to other for non-item pages and unmatched routes', () => {
    expect(toShareArrivalType('/users/[user]')).toBe('other');
    expect(toShareArrivalType(null)).toBe('other');
  });
});
