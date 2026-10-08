import { describe, expect, it } from 'vitest';
import { isRightGuess } from './isRightGuess.ts';

describe('util: isRightGuess', () => {
  it('should accept higher when the mystery rating is higher', () => {
    expect(isRightGuess({ known: 70, mystery: 85, guess: 'higher' })).toBe(
      true,
    );
    expect(isRightGuess({ known: 70, mystery: 85, guess: 'lower' })).toBe(
      false,
    );
  });

  it('should accept lower when the mystery rating is lower', () => {
    expect(isRightGuess({ known: 85, mystery: 70, guess: 'lower' })).toBe(
      true,
    );
    expect(isRightGuess({ known: 85, mystery: 70, guess: 'higher' })).toBe(
      false,
    );
  });

  it('should accept either guess on a tie', () => {
    expect(isRightGuess({ known: 80, mystery: 80, guess: 'higher' })).toBe(
      true,
    );
    expect(isRightGuess({ known: 80, mystery: 80, guess: 'lower' })).toBe(
      true,
    );
  });
});
