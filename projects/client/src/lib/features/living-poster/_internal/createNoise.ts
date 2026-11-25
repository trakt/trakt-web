import { createRandom } from './createRandom.ts';

const POINTS = 256;

export function createNoise(seed: number) {
  const random = createRandom(seed);
  const points = Array.from({ length: POINTS }, random);

  return (position: number) => {
    const index = Math.floor(position);
    const fraction = position - index;
    const eased = fraction * fraction * (3 - 2 * fraction);
    const from = points[index & (POINTS - 1)] ?? 0;
    const to = points[(index + 1) & (POINTS - 1)] ?? 0;

    return from * (1 - eased) + to * eased;
  };
}
