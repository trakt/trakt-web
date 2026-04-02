import { describe, expect, it } from 'vitest';
import type { PulseStat } from './models/PulseStat.ts';
import { rankStats } from './rankStats.ts';

const stat = (
  key: string,
  value: number,
  delta: number | null,
  note?: string,
): PulseStat => ({
  key,
  rawValue: value,
  value: String(value),
  label: key,
  delta,
  note,
});

const emptyCounts = new Map<string, number>([
  ['totalPlays', 0],
  ['episodes', 0],
  ['movies', 0],
]);

describe('rankStats', () => {
  it('ranks higher delta stats first', () => {
    const candidates = [
      stat('hours', 5, 1),
      stat('shows', 10, 8),
      stat('activeDays', 3, 0),
    ];
    const result = rankStats(candidates, emptyCounts);
    expect(result[0]!.key).toBe('shows');
  });

  it('ranks stats with notes above zero-value zero-delta stats', () => {
    const candidates = [
      stat('busiestDay', 0, null, 'was Thu last week'),
      stat('movies', 0, 0),
    ];
    const result = rankStats(candidates, emptyCounts);
    expect(result[0]!.key).toBe('busiestDay');
  });

  it('keeps all candidates but deprioritizes redundant ones', () => {
    const candidates = [
      stat('totalPlays', 35, 9),
      stat('episodes', 35, 9),
      stat('movies', 0, 0),
    ];
    const rawCounts = new Map([['totalPlays', 35], ['episodes', 35], [
      'movies',
      0,
    ]]);
    const result = rankStats(candidates, rawCounts);
    expect(result).toHaveLength(3);
    // episodes is not redundant, should be first
    expect(result[0]!.key).toBe('episodes');
    // totalPlays and movies are both redundant — totalPlays has higher base score
    expect(result[1]!.key).toBe('totalPlays');
    expect(result[2]!.key).toBe('movies');
  });

  it('deprioritizes zero-value zero-delta stats', () => {
    const candidates = [
      stat('shows', 5, 2),
      stat('movies', 0, 0),
    ];
    const rawCounts = new Map([['totalPlays', 5], ['episodes', 5], [
      'movies',
      0,
    ]]);
    const result = rankStats(candidates, rawCounts);
    expect(result[0]!.key).toBe('shows');
    expect(result[1]!.key).toBe('movies');
  });
});
