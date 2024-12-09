import { random } from '../number/random.ts';

export function shuffle<T>(items: T[]) {
  const randomSort = () => random(-1, 1);

  return items
    .toSorted(randomSort);
}
