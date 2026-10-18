import type { Guess } from './Guess.ts';

type ToSwipeGuessParams = {
  startY: number | null;
  endY: number | undefined;
  threshold: number;
};

export function toSwipeGuess({
  startY,
  endY,
  threshold,
}: ToSwipeGuessParams): Guess | null {
  if (startY === null || endY === undefined) return null;

  const distance = endY - startY;
  if (Math.abs(distance) < threshold) return null;

  return distance < 0 ? 'higher' : 'lower';
}
