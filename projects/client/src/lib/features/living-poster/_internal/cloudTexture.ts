import type { Rgb } from '../models/Rgb.ts';
import { createRandom } from './createRandom.ts';

type CloudTextureParams = {
  seed: number;
  color: Rgb;
  from: number;
  to: number;
};

const SIZE = 128;
const OCTAVES = 5;

const smooth = (value: number) => value * value * (3 - 2 * value);

function createOctaves(seed: number) {
  const random = createRandom(seed);

  return Array.from({ length: OCTAVES }, (_, octave) => {
    const period = 4 << octave;
    return {
      period,
      grid: Array.from({ length: period * period }, random),
    };
  });
}

function sampleOctaves({
  octaves,
  column,
  row,
}: {
  octaves: ReturnType<typeof createOctaves>;
  column: number;
  row: number;
}) {
  const { sum, total } = octaves.reduce(
    (acc, { period, grid }, octave) => {
      const amplitude = 0.5 ** (octave + 1);
      const fx = (column / SIZE) * period;
      const fy = (row / SIZE) * period;
      const x0 = Math.floor(fx);
      const y0 = Math.floor(fy);
      const ux = smooth(fx - x0);
      const uy = smooth(fy - y0);
      const at = (x: number, y: number) =>
        grid[(y % period) * period + (x % period)] ?? 0;
      const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * ux;
      const bottom =
        at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * ux;

      return {
        sum: acc.sum + amplitude * (top + (bottom - top) * uy),
        total: acc.total + amplitude,
      };
    },
    { sum: 0, total: 0 },
  );

  return sum / total;
}

export function cloudTexture({ seed, color, from, to }: CloudTextureParams) {
  const texture = document.createElement('canvas');
  texture.width = SIZE;
  texture.height = SIZE;

  const context = texture.getContext('2d');
  if (!context) return texture;

  const octaves = createOctaves(seed);
  const image = context.createImageData(SIZE, SIZE);

  for (let row = 0; row < SIZE; row++) {
    for (let column = 0; column < SIZE; column++) {
      const value = sampleOctaves({ octaves, column, row });
      const ramp = Math.min(1, Math.max(0, (value - from) / (to - from)));
      const offset = (row * SIZE + column) * 4;
      image.data[offset] = color[0];
      image.data[offset + 1] = color[1];
      image.data[offset + 2] = color[2];
      image.data[offset + 3] = 255 * smooth(ramp);
    }
  }

  context.putImageData(image, 0, 0);
  return texture;
}
