import { describe, expect, it } from 'vitest';
import { countWatchedEpisodes } from './countWatchedEpisodes.ts';

describe('countWatchedEpisodes', () => {
  it('should return 0 for an empty map', () => {
    expect(countWatchedEpisodes(new Map())).toBe(0);
  });

  it('should exclude specials (season 0)', () => {
    expect(countWatchedEpisodes(new Map([[0, 3]]))).toBe(0);
  });

  it('should count episodes from a single regular season', () => {
    expect(countWatchedEpisodes(new Map([[1, 8]]))).toBe(8);
  });

  it('should sum episodes across multiple regular seasons', () => {
    expect(countWatchedEpisodes(new Map([[1, 10], [2, 8]]))).toBe(18);
  });

  it('should exclude specials but include regular seasons', () => {
    expect(countWatchedEpisodes(new Map([[0, 2], [1, 6], [2, 4]]))).toBe(10);
  });
});
