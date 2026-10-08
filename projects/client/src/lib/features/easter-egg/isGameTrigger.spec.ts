import { describe, expect, it } from 'vitest';
import { isGameTrigger } from './isGameTrigger.ts';

describe('util: isGameTrigger', () => {
  it('should match the exact phrase', () => {
    expect(isGameTrigger('I want to play a game')).toBe(true);
  });

  it('should ignore case, punctuation and extra spaces', () => {
    expect(isGameTrigger('  i WANT to   play a game!? ')).toBe(true);
    expect(isGameTrigger('"I want to play a game."')).toBe(true);
  });

  it('should not match a partial phrase', () => {
    expect(isGameTrigger('I want to play a')).toBe(false);
  });

  it('should not match a longer phrase', () => {
    expect(isGameTrigger('I want to play a game of thrones')).toBe(false);
  });

  it('should not match an empty query', () => {
    expect(isGameTrigger('')).toBe(false);
    expect(isGameTrigger(undefined)).toBe(false);
  });
});
