import { describe, expect, it } from 'vitest';
import { isGameKeyword } from './isGameKeyword.ts';

describe('util: isGameKeyword', () => {
  it('should match the single word game', () => {
    expect(isGameKeyword('game')).toBe(true);
  });

  it('should ignore case, punctuation and surrounding spaces', () => {
    expect(isGameKeyword('  GAME! ')).toBe(true);
  });

  it('should not match other words containing game', () => {
    expect(isGameKeyword('games')).toBe(false);
    expect(isGameKeyword('game of thrones')).toBe(false);
    expect(isGameKeyword('squid game')).toBe(false);
  });

  it('should not match an empty query', () => {
    expect(isGameKeyword('')).toBe(false);
    expect(isGameKeyword(undefined)).toBe(false);
  });
});
