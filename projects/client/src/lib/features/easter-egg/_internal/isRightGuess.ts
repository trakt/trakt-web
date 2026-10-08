import type { Guess } from './Guess.ts';

type IsRightGuessParams = {
  known: number;
  mystery: number;
  guess: Guess;
};

export function isRightGuess(
  { known, mystery, guess }: IsRightGuessParams,
): boolean {
  return guess === 'higher' ? mystery >= known : mystery <= known;
}
