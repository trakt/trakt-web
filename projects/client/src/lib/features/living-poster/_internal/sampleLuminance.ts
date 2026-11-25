import { loadImage } from './loadImage.ts';

const COLUMNS = 30;
const ROWS = 45;

const toCell = (value: number, cells: number) =>
  Math.min(cells - 1, Math.max(0, Math.floor(value * cells)));

function readLuminance(image: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = COLUMNS;
  canvas.height = ROWS;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return null;

  context.drawImage(image, 0, 0, COLUMNS, ROWS);
  const { data } = context.getImageData(0, 0, COLUMNS, ROWS);

  return Float32Array.from({ length: COLUMNS * ROWS }, (_, index) => {
    const offset = index * 4;
    const red = data[offset] ?? 0;
    const green = data[offset + 1] ?? 0;
    const blue = data[offset + 2] ?? 0;
    const alpha = data[offset + 3] ?? 0;

    return (
      ((0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255) * (alpha / 255)
    );
  });
}

export async function sampleLuminance(src: string) {
  try {
    const image = await loadImage({ src, crossOrigin: 'anonymous' });
    const grid = readLuminance(image);
    if (!grid) return null;

    return (x: number, y: number) =>
      grid[toCell(y, ROWS) * COLUMNS + toCell(x, COLUMNS)] ?? 0;
  } catch {
    return null;
  }
}
