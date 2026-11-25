import type { CanvasEffect } from '../../models/CanvasEffect.ts';
import type { EffectPainter } from '../../models/EffectPainter.ts';
import type { Rgb } from '../../models/Rgb.ts';
import { createFractalNoise } from '../createFractalNoise.ts';
import { drawSprite } from '../drawSprite.ts';
import { radialSprite } from '../radialSprite.ts';

type Ghost = readonly [reach: number, size: number, color: Rgb, alpha: number];

const GHOSTS: ReadonlyArray<Ghost> = [
  [0.5, 0.035, [120, 170, 255], 0.1],
  [0.85, 0.06, [255, 190, 120], 0.06],
  [1.25, 0.022, [160, 255, 210], 0.14],
  [1.55, 0.1, [170, 140, 255], 0.05],
  [2.05, 0.045, [255, 150, 120], 0.08],
];

const HALO: Rgb = [255, 176, 110];
const GLOW: Rgb = [255, 240, 215];
const CORE: Rgb = [255, 255, 255];
const DEFAULT_AT = [50, 30] as const;
const STREAK_WIDTH = 256;
const STREAK_HEIGHT = 32;
const RING_SIZE = 128;

const sprites: { streak?: HTMLCanvasElement; ring?: HTMLCanvasElement } = {};

function createSprite({
  width,
  height,
  paint,
}: {
  width: number;
  height: number;
  paint: (context: CanvasRenderingContext2D) => void;
}) {
  const sprite = document.createElement('canvas');
  sprite.width = width;
  sprite.height = height;

  const context = sprite.getContext('2d');
  if (context) paint(context);

  return sprite;
}

function streakSprite() {
  sprites.streak ??= createSprite({
    width: STREAK_WIDTH,
    height: STREAK_HEIGHT,
    paint: (context) => {
      const half = STREAK_WIDTH / 2;
      context.translate(half, STREAK_HEIGHT / 2);
      context.scale(1, STREAK_HEIGHT / STREAK_WIDTH);
      const streak = context.createRadialGradient(0, 0, 0, 0, 0, half);
      streak.addColorStop(0, 'rgba(240, 247, 255, 1)');
      streak.addColorStop(0.06, 'rgba(175, 208, 255, 0.75)');
      streak.addColorStop(0.35, 'rgba(105, 150, 255, 0.22)');
      streak.addColorStop(1, 'rgba(80, 120, 255, 0)');
      context.fillStyle = streak;
      context.fillRect(-half, -half, STREAK_WIDTH, STREAK_WIDTH);
    },
  });

  return sprites.streak;
}

function ringSprite() {
  sprites.ring ??= createSprite({
    width: RING_SIZE,
    height: RING_SIZE,
    paint: (context) => {
      const half = RING_SIZE / 2;
      const ring = context.createRadialGradient(
        half,
        half,
        0,
        half,
        half,
        half,
      );
      ring.addColorStop(0, 'rgba(255, 255, 255, 0)');
      ring.addColorStop(0.68, 'rgba(120, 160, 255, 0.05)');
      ring.addColorStop(0.78, 'rgba(120, 170, 255, 0.2)');
      ring.addColorStop(0.85, 'rgba(150, 255, 200, 0.22)');
      ring.addColorStop(0.91, 'rgba(255, 210, 130, 0.24)');
      ring.addColorStop(0.96, 'rgba(255, 110, 90, 0.14)');
      ring.addColorStop(1, 'rgba(255, 90, 80, 0)');
      context.fillStyle = ring;
      context.fillRect(0, 0, RING_SIZE, RING_SIZE);
    },
  });

  return sprites.ring;
}

export function createFlarePainter({
  effect,
  seed,
}: {
  effect: CanvasEffect;
  seed: number;
}): EffectPainter {
  const [atX, atY] = effect.kind === 'flare' ? effect.at : DEFAULT_AT;
  const breathing = createFractalNoise(seed);

  return {
    front: ({ context, seconds, width, height, unit, tilt }) => {
      const x = (atX / 100) * width;
      const y = (atY / 100) * height;
      const facing = Math.min(
        1.35,
        Math.max(
          0.75,
          1 + 0.3 * (tilt.x * (atX / 50 - 1) + tilt.y * (atY / 50 - 1)),
        ),
      );
      const strength =
        effect.intensity *
        1.6 *
        (0.9 + 0.1 * breathing(seconds * 0.35)) *
        facing;
      const at = { context, x, y };

      drawSprite({
        ...at,
        sprite: radialSprite({ color: HALO, profile: 'soft' }),
        width: width * 0.75,
        alpha: 0.14 * strength,
      });
      drawSprite({
        ...at,
        sprite: radialSprite({ color: GLOW, profile: 'soft' }),
        width: width * 0.26,
        alpha: 0.5 * strength,
      });
      drawSprite({
        ...at,
        sprite: radialSprite({ color: CORE, profile: 'core' }),
        width: width * 0.07,
        alpha: 0.95 * strength,
      });
      drawSprite({
        ...at,
        sprite: ringSprite(),
        width: width * 0.42,
        alpha: 0.22 * strength,
      });
      drawSprite({
        ...at,
        sprite: streakSprite(),
        width: width * 2.4 * (0.95 + 0.05 * breathing(seconds * 0.6 + 3)),
        height: 7 * unit,
        alpha: 0.45 * strength,
      });
      drawSprite({
        ...at,
        sprite: streakSprite(),
        width: width * 1.5,
        height: 1.8 * unit,
        alpha: 0.8 * strength,
      });

      const centerX = width * (0.5 - tilt.x * 0.16);
      const centerY = height * (0.5 - tilt.y * 0.16);
      const along = (reach: number) => ({
        x: x + (centerX - x) * reach,
        y: y + (centerY - y) * reach,
      });
      for (const [reach, size, color, alpha] of GHOSTS) {
        drawSprite({
          context,
          ...along(reach),
          sprite: radialSprite({ color, profile: 'bokeh' }),
          width: size * width * 2,
          alpha: alpha * strength,
        });
      }
      drawSprite({
        context,
        ...along(1.4),
        sprite: ringSprite(),
        width: width * 0.2,
        alpha: 0.3 * strength,
      });
    },
  };
}
