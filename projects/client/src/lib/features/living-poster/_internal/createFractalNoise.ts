import { createNoise } from './createNoise.ts';

export function createFractalNoise(seed: number) {
  const coarse = createNoise(seed);
  const middle = createNoise(seed + 17);
  const fine = createNoise(seed + 59);

  return (position: number) =>
    (coarse(position) * 2 - 1) * 0.6 +
    (middle(position * 2.3 + 7.1) * 2 - 1) * 0.3 +
    (fine(position * 5.3 + 3.7) * 2 - 1) * 0.1;
}
