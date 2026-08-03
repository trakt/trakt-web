import { describe, expect, it } from 'vitest';
import type { UniversalImportItem } from './ImportTypes.ts';
import { toImportItemLabel } from './toImportItemLabel.ts';

describe('util: toImportItemLabel', () => {
  it('should use the title when there is one', () => {
    const item: UniversalImportItem = {
      action: 'history',
      type: 'movie',
      ids: { tmdb: 550 },
      title: 'fight club',
    };

    expect(toImportItemLabel(item)).toBe('fight club');
  });

  it('should fall back to an id when there is no title', () => {
    const item: UniversalImportItem = {
      action: 'history',
      type: 'episode',
      ids: { tmdb: 3485337 },
    };

    expect(toImportItemLabel(item)).toBe('tmdb:3485337');
  });

  it('should prefer imdb over the other ids', () => {
    const item: UniversalImportItem = {
      action: 'history',
      type: 'movie',
      ids: { imdb: 'tt0137523', tmdb: 550 },
    };

    expect(toImportItemLabel(item)).toBe('imdb:tt0137523');
  });

  it('should fall back to the type when there is nothing else', () => {
    const item: UniversalImportItem = {
      action: 'history',
      type: 'episode',
      ids: {},
    };

    expect(toImportItemLabel(item)).toBe('episode');
  });
});
