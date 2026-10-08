import { describe, expect, it } from 'vitest';
import type { GameTitle } from './GameTitle.ts';
import { pickNextTitle } from './pickNextTitle.ts';

const title = (key: string, rating: number): GameTitle => ({
  key,
  title: key,
  type: 'movie',
  year: 2020,
  rating,
  poster: `https://example.com/${key}.jpg`,
});

const current = title('current', 80);
const pool = [
  current,
  title('far', 60),
  title('mid', 72),
  title('close', 78),
];

const first = () => 0;

describe('util: pickNextTitle', () => {
  it('should pick a far apart title early in a run', () => {
    const next = pickNextTitle({
      pool,
      current,
      usedKeys: new Set(),
      streak: 0,
      random: first,
    });

    expect(next?.key).toBe('far');
  });

  it('should pick a closer title after a streak of 5', () => {
    const next = pickNextTitle({
      pool,
      current,
      usedKeys: new Set(),
      streak: 5,
      random: first,
    });

    expect(next?.key).toBe('mid');
  });

  it('should pick a title within 5% after a streak of 10', () => {
    const next = pickNextTitle({
      pool,
      current,
      usedKeys: new Set(),
      streak: 10,
      random: first,
    });

    expect(next?.key).toBe('close');
  });

  it('should skip titles already used in the run', () => {
    const next = pickNextTitle({
      pool,
      current,
      usedKeys: new Set(['far']),
      streak: 0,
      random: first,
    });

    expect(next?.key).not.toBe('far');
  });

  it('should fall back to any other title when nothing fits the band', () => {
    const next = pickNextTitle({
      pool: [current, title('close', 78)],
      current,
      usedKeys: new Set(),
      streak: 0,
      random: first,
    });

    expect(next?.key).toBe('close');
  });

  it('should reuse titles once every title has been used', () => {
    const next = pickNextTitle({
      pool,
      current,
      usedKeys: new Set(['far', 'mid', 'close']),
      streak: 0,
      random: first,
    });

    expect(next?.key).toBe('far');
  });

  it('should never pick the current title', () => {
    const next = pickNextTitle({
      pool: [current],
      current,
      usedKeys: new Set(),
      streak: 0,
      random: first,
    });

    expect(next).toBeUndefined();
  });
});
