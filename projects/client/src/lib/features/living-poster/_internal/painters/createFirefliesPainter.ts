import type { CanvasEffect } from '../../models/CanvasEffect.ts';
import type { EffectPainter } from '../../models/EffectPainter.ts';
import { createNoise } from '../createNoise.ts';
import { createRandom } from '../createRandom.ts';
import { glowSprite } from '../glowSprite.ts';
import { intensityScale } from '../intensityScale.ts';
import { interpolate } from '../interpolate.ts';

const COUNT = 16;
const SEED_RANGE = 1_000_000;

export function createFirefliesPainter({
  effect,
  seed,
}: {
  effect: CanvasEffect;
  seed: number;
}): EffectPainter {
  const random = createRandom(seed);
  const count = Math.round(COUNT * intensityScale(effect.intensity));
  const flies = Array.from({ length: count }, () => ({
    pathX: createNoise(Math.floor(random() * SEED_RANGE)),
    pathY: createNoise(Math.floor(random() * SEED_RANGE)),
    phase: random() * 10,
    blink: 3 + random() * 3,
    size: 2 + random() * 2,
  }));

  return {
    back: ({ context, seconds, width, height, unit }) => {
      const halo = glowSprite({ color: '#d8ff6a', isSoft: true });
      const core = glowSprite({ color: '#fbffd0' });

      for (const fly of flies) {
        const progress = ((seconds + fly.phase) % fly.blink) / fly.blink;
        const opacity = interpolate(progress, [
          [0, 0],
          [0.1, 1],
          [0.35, 0.9],
          [0.55, 0],
          [1, 0],
        ]);
        if (opacity < 0.02) continue;

        const x =
          fly.pathX(seconds * 0.12 + fly.phase) * width * 1.2 - width * 0.1;
        const y =
          fly.pathY(seconds * 0.1 + fly.phase * 2) * height * 1.1 -
          height * 0.05;
        const radius = fly.size * unit;

        context.globalAlpha = opacity * 0.6;
        context.drawImage(
          halo,
          x - radius * 6,
          y - radius * 6,
          radius * 12,
          radius * 12,
        );
        context.globalAlpha = opacity;
        context.drawImage(
          core,
          x - radius * 1.5,
          y - radius * 1.5,
          radius * 3,
          radius * 3,
        );
      }

      context.globalAlpha = 1;
    },
  };
}
