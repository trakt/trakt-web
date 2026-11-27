import { MovieLoreVipMappedMock } from '$mocks/data/summary/movie-lore/mapped/MovieLoreVipMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toLoreHeroLabel } from './toLoreHeroLabel.ts';

describe('util: toLoreHeroLabel', () => {
  it('should name the kind and the number of earlier films', () => {
    expect(toLoreHeroLabel(MovieLoreVipMappedMock)).toBe(
      'Series · 1 earlier film',
    );
  });

  it('should name only the kind without earlier films', () => {
    expect(toLoreHeroLabel({ kind: 'standalone', earlier: [] })).toBe(
      'Original',
    );
  });

  it('should pluralize the earlier films', () => {
    const [first] = MovieLoreVipMappedMock.earlier;

    expect(
      toLoreHeroLabel({
        kind: 'series',
        earlier: first ? [first, first] : [],
      }),
    ).toBe('Series · 2 earlier films');
  });
});
