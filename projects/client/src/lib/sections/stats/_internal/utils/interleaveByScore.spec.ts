import { describe, expect, it } from 'vitest';
import type { PulseGraphItem } from '../models/PulseGraphItem.ts';
import type { PulseStatItem } from '../models/PulseStatItem.ts';
import { interleaveByScore } from './interleaveByScore.ts';

function stat(key: string, score: number): PulseStatItem {
  return {
    type: 'stat',
    key,
    score,
    rawValue: 0,
    value: '0',
    label: key,
    delta: 0,
  };
}

function graph(key: string, score: number): PulseGraphItem {
  return {
    type: 'graph',
    key,
    kind: 'dailyBars',
    data: {} as PulseGraphItem['data'],
    score,
  };
}

describe('interleaveByScore', () => {
  it('sorts all items by score descending', () => {
    const result = interleaveByScore(
      [stat('a', 90), stat('b', 50)],
      [graph('g1', 70)],
    );
    expect(result.map((r) => r.key)).toEqual(['a', 'g1', 'b']);
  });

  it('enforces max 2 consecutive graphs when stats available', () => {
    const result = interleaveByScore(
      [stat('a', 100), stat('b', 30), stat('c', 10)],
      [graph('g1', 90), graph('g2', 80), graph('g3', 60), graph('g4', 20)],
    );
    const types = result.map((r) => r.type);
    for (let i = 0; i < types.length - 2; i++) {
      const threeConsecutive = types[i] === 'graph' &&
        types[i + 1] === 'graph' &&
        types[i + 2] === 'graph';
      expect(threeConsecutive).toBe(false);
    }
  });

  it('appends remaining graphs at tail when no stats left to break them up', () => {
    const result = interleaveByScore(
      [stat('a', 100)],
      [graph('g1', 90), graph('g2', 80), graph('g3', 70)],
    );
    expect(result.map((r) => r.key)).toEqual(['a', 'g1', 'g2', 'g3']);
  });

  it('interleaves deferred graphs after next stat', () => {
    const result = interleaveByScore(
      [stat('a', 100), stat('b', 40)],
      [graph('g1', 90), graph('g2', 80), graph('g3', 60)],
    );
    expect(result.map((r) => r.key)).toEqual(['a', 'g1', 'g2', 'b', 'g3']);
  });

  it('returns empty for no items', () => {
    expect(interleaveByScore([], [])).toEqual([]);
  });

  it('works with stats only', () => {
    const result = interleaveByScore(
      [stat('a', 90), stat('b', 50)],
      [],
    );
    expect(result.map((r) => r.key)).toEqual(['a', 'b']);
  });

  it('works with graphs only', () => {
    const result = interleaveByScore(
      [],
      [graph('g1', 90), graph('g2', 80), graph('g3', 70)],
    );
    expect(result.map((r) => r.key)).toEqual(['g1', 'g2', 'g3']);
  });
});
