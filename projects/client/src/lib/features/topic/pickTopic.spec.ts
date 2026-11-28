import { describe, expect, it } from 'vitest';
import { pickTopic } from './pickTopic.ts';

const DUNE_PART_THREE = 943606;
const AVENGERS_DOOMSDAY = 806490;

describe('util: pickTopic', () => {
  it('should pick no topic when neither film is watchlisted', () => {
    expect(pickTopic(new Set([1, 2, 3]))).toBeNull();
  });

  it('should pick dune-3 when only Dune: Part Three is watchlisted', () => {
    expect(pickTopic(new Set([1, DUNE_PART_THREE]))).toBe('dune-3');
  });

  it('should pick avengers-doomsday when only Avengers: Doomsday is watchlisted', () => {
    expect(pickTopic(new Set([AVENGERS_DOOMSDAY, 7]))).toBe(
      'avengers-doomsday',
    );
  });

  it('should pick dunesday when both films are watchlisted', () => {
    expect(pickTopic(new Set([DUNE_PART_THREE, AVENGERS_DOOMSDAY]))).toBe(
      'dunesday',
    );
  });

  it('should pick no topic for an empty watchlist', () => {
    expect(pickTopic(new Set())).toBeNull();
  });

  it('should pick no topic when the watchlist is not loaded', () => {
    expect(pickTopic(undefined)).toBeNull();
    expect(pickTopic(null)).toBeNull();
  });
});
