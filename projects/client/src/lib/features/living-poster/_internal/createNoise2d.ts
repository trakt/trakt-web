import { createRandom } from './createRandom.ts';

const POINTS = 256;

const ease = (fraction: number) => fraction * fraction * (3 - 2 * fraction);

export function createNoise2d(seed: number) {
  const random = createRandom(seed);
  const order = Array.from({ length: POINTS }, (_, index) => ({
    index,
    rank: random(),
  }))
    .toSorted((a, b) => a.rank - b.rank)
    .map(({ index }) => index);
  const values = Float32Array.from({ length: POINTS }, () => random() * 2 - 1);
  const shuffle = (index: number) => order[index & (POINTS - 1)] ?? 0;
  const at = (column: number, row: number) =>
    values[shuffle(shuffle(column) + row)] ?? 0;

  return (x: number, y: number) => {
    const column = Math.floor(x);
    const row = Math.floor(y);
    const u = ease(x - column);
    const v = ease(y - row);
    const topLeft = at(column, row);
    const topRight = at(column + 1, row);
    const bottomLeft = at(column, row + 1);
    const bottomRight = at(column + 1, row + 1);

    return (
      topLeft +
      (topRight - topLeft) * u +
      (bottomLeft -
        topLeft +
        (bottomRight - bottomLeft - topRight + topLeft) * u) *
        v
    );
  };
}
