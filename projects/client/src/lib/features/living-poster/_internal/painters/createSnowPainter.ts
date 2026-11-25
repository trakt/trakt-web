import type { CanvasEffect } from '../../models/CanvasEffect.ts';
import type { EffectPainter } from '../../models/EffectPainter.ts';
import type { EffectScene } from '../../models/EffectScene.ts';
import { createRandom } from '../createRandom.ts';
import { glowSprite } from '../glowSprite.ts';
import { intensityScale } from '../intensityScale.ts';
import { interpolate } from '../interpolate.ts';

type Depth = {
  count: number;
  size: readonly [number, number];
  duration: readonly [number, number];
  opacity: number;
};

const FAR: Depth = {
  count: 70,
  size: [0.8, 1.6],
  duration: [12, 18],
  opacity: 0.6,
};
const MID: Depth = {
  count: 36,
  size: [2, 3.5],
  duration: [8, 12],
  opacity: 0.85,
};
const NEAR: Depth = {
  count: 9,
  size: [7, 13],
  duration: [5, 8],
  opacity: 0.45,
};

function createFlakes({
  depth,
  random,
  scale,
}: {
  depth: Depth;
  random: () => number;
  scale: number;
}) {
  const span = ([from, to]: readonly [number, number]) =>
    from + random() * (to - from);

  return Array.from({ length: Math.round(depth.count * scale) }, () => ({
    x: random() * 100,
    phase: random(),
    size: span(depth.size),
    duration: span(depth.duration),
    sway: 2 + random() * 5,
    swaySpeed: 0.5 + random(),
    opacity: depth.opacity,
  }));
}

type Flake = ReturnType<typeof createFlakes>[number];

function placeFlake(scene: EffectScene, flake: Flake, depth: number) {
  const { seconds, width, height, unit, tilt } = scene;
  const progress = (seconds / flake.duration + flake.phase) % 1;
  const sway =
    Math.sin(seconds * flake.swaySpeed + flake.phase * 9) * flake.sway;

  return {
    progress,
    x: ((flake.x + sway) / 100) * width + tilt.x * (depth + 1) * 3 * unit,
    y: (progress * 1.15 - 0.08) * height,
    radius: flake.size * unit,
  };
}

export function createSnowPainter({
  effect,
  seed,
}: {
  effect: CanvasEffect;
  seed: number;
}): EffectPainter {
  const random = createRandom(seed);
  const scale = intensityScale(effect.intensity);
  const far = createFlakes({ depth: FAR, random, scale });
  const mid = createFlakes({ depth: MID, random, scale });
  const near = createFlakes({ depth: NEAR, random, scale });

  return {
    back: (scene) => {
      const { context } = scene;
      context.fillStyle = '#ffffff';

      [far, mid].forEach((flakes, depth) => {
        for (const flake of flakes) {
          const { x, y, radius } = placeFlake(scene, flake, depth);
          context.globalAlpha = flake.opacity;
          context.beginPath();
          context.arc(x, y, radius / 2, 0, Math.PI * 2);
          context.fill();
        }
      });

      context.globalAlpha = 1;
    },
    front: (scene) => {
      const { context } = scene;
      const sprite = glowSprite({ color: '#ffffff', isSoft: true });

      for (const flake of near) {
        const { progress, x, y, radius } = placeFlake(scene, flake, 2);
        context.globalAlpha =
          flake.opacity *
          interpolate(progress, [
            [0, 0],
            [0.15, 1],
            [0.85, 1],
            [1, 0],
          ]);
        context.drawImage(
          sprite,
          x - radius,
          y - radius,
          radius * 2,
          radius * 2,
        );
      }

      context.globalAlpha = 1;
    },
  };
}
