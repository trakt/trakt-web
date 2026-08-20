import { describe, expect, it } from 'vitest';
import type { UniversalImportItem } from '../../ImportTypes.ts';
import { isValidItem } from './isValidItem.ts';

const base = { action: 'history' } as const;

describe('util: isValidItem', () => {
  it('should accept a season resolvable by tvdb', () => {
    expect(isValidItem({
      ...base,
      type: 'season',
      ids: { tvdb: 12345 },
    } as UniversalImportItem)).toBe(true);
  });

  it('should reject a season carrying only an imdb id', () => {
    expect(isValidItem({
      ...base,
      type: 'season',
      ids: { imdb: 'tt0306414' },
    } as UniversalImportItem)).toBe(false);
  });

  it('should reject a movie carrying only a tvdb id', () => {
    expect(isValidItem({
      ...base,
      type: 'movie',
      ids: { tvdb: 79126 },
    } as UniversalImportItem)).toBe(false);
  });

  it('should accept a show carrying only a tvdb id', () => {
    expect(isValidItem({
      ...base,
      type: 'show',
      ids: { tvdb: 79126 },
    } as UniversalImportItem)).toBe(true);
  });

  it('should accept an unresolvable item that still has title and year', () => {
    expect(isValidItem({
      ...base,
      type: 'movie',
      ids: { tvdb: 79126 },
      title: 'Heretic',
      year: 2024,
    } as UniversalImportItem)).toBe(true);
  });

  it('should accept a positional episode with no ids of its own', () => {
    expect(isValidItem({
      ...base,
      type: 'episode',
      ids: {},
      showTvdb: 81189,
      season: 3,
      episode: 7,
    } as UniversalImportItem)).toBe(true);
  });

  it('should reject an episode with no ids and no positional key', () => {
    expect(isValidItem({
      ...base,
      type: 'episode',
      ids: {},
    } as UniversalImportItem)).toBe(false);
  });
});
