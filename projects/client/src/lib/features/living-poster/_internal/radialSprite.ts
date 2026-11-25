import type { Rgb } from '../models/Rgb.ts';
import { toRgba } from './toRgba.ts';

type RadialSpriteParams = {
  color: Rgb;
  profile: 'core' | 'soft' | 'bokeh';
};

const SIZE = 64;
const PROFILES: Record<
  RadialSpriteParams['profile'],
  ReadonlyArray<readonly [at: number, alpha: number]>
> = {
  core: [
    [0, 1],
    [0.16, 0.95],
    [0.4, 0.26],
    [0.7, 0.05],
    [1, 0],
  ],
  soft: [
    [0, 1],
    [0.28, 0.45],
    [0.62, 0.11],
    [1, 0],
  ],
  bokeh: [
    [0, 0.5],
    [0.6, 0.56],
    [0.8, 0.5],
    [0.92, 0.16],
    [1, 0],
  ],
};
const sprites = new Map<string, HTMLCanvasElement>();

function createSprite({ color, profile }: RadialSpriteParams) {
  const sprite = document.createElement('canvas');
  sprite.width = SIZE;
  sprite.height = SIZE;

  const context = sprite.getContext('2d');
  if (!context) return sprite;

  const half = SIZE / 2;
  const gradient = context.createRadialGradient(
    half,
    half,
    0,
    half,
    half,
    half,
  );
  for (const [at, alpha] of PROFILES[profile]) {
    gradient.addColorStop(at, toRgba(color, alpha));
  }
  context.fillStyle = gradient;
  context.fillRect(0, 0, SIZE, SIZE);

  return sprite;
}

export function radialSprite(params: RadialSpriteParams) {
  const key = `${params.profile}:${params.color.map(Math.round).join(',')}`;
  const cached = sprites.get(key) ?? createSprite(params);
  sprites.set(key, cached);

  return cached;
}
