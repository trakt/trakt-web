import type { PosterBox } from '../models/LivingPosterEffect.ts';

type ToPixelBoxParams = {
  box: PosterBox;
  width: number;
  height: number;
};

export function toPixelBox({ box, width, height }: ToPixelBoxParams) {
  const [x, y, boxWidth, boxHeight] = box;

  return {
    x: (x / 100) * width,
    y: (y / 100) * height,
    width: (boxWidth / 100) * width,
    height: (boxHeight / 100) * height,
  };
}
