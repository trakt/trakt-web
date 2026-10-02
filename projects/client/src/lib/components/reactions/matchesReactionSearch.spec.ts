import { describe, expect, it } from 'vitest';
import { matchesReactionSearch } from './matchesReactionSearch.ts';

const rofl = {
  id: 'rofl',
  label: 'Rolling on the floor',
  code: '1f923',
  keywords: ['lol', 'laugh', 'funny'],
};

const mindBlown = {
  id: 'mind_blown',
  label: 'Mind blown',
  code: '1f92f',
  keywords: ['omg', 'twist'],
};

describe('util: matchesReactionSearch', () => {
  it('should match every reaction for an empty query', () => {
    expect(matchesReactionSearch(rofl, '  ')).toBe(true);
  });

  it('should match on the label, case-insensitively', () => {
    expect(matchesReactionSearch(rofl, 'FLOOR')).toBe(true);
  });

  it('should match on a keyword', () => {
    expect(matchesReactionSearch(rofl, 'lol')).toBe(true);
    expect(matchesReactionSearch(mindBlown, 'omg')).toBe(true);
  });

  it('should match the id with spaces for underscores', () => {
    expect(matchesReactionSearch(mindBlown, 'mind bl')).toBe(true);
  });

  it('should ignore diacritics', () => {
    expect(matchesReactionSearch(mindBlown, 'twïst')).toBe(true);
  });

  it('should not match unrelated text', () => {
    expect(matchesReactionSearch(rofl, 'sdf')).toBe(false);
  });
});
