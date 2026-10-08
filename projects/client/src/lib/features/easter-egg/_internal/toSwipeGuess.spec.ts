import { describe, expect, it } from 'vitest';
import { toSwipeGuess } from './toSwipeGuess.ts';

describe('util: toSwipeGuess', () => {
  it('should guess higher when swiping up', () => {
    expect(toSwipeGuess({ startY: 300, endY: 200, threshold: 40 })).toBe(
      'higher',
    );
  });

  it('should guess lower when swiping down', () => {
    expect(toSwipeGuess({ startY: 200, endY: 300, threshold: 40 })).toBe(
      'lower',
    );
  });

  it('should ignore swipes shorter than the threshold', () => {
    expect(toSwipeGuess({ startY: 200, endY: 230, threshold: 40 })).toBeNull();
  });

  it('should ignore a swipe without a start or an end', () => {
    expect(toSwipeGuess({ startY: null, endY: 100, threshold: 40 }))
      .toBeNull();
    expect(toSwipeGuess({ startY: 100, endY: undefined, threshold: 40 }))
      .toBeNull();
  });
});
