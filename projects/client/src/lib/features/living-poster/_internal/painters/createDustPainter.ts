import type { CanvasEffect } from '../../models/CanvasEffect.ts';
import type { EffectPainter } from '../../models/EffectPainter.ts';
import type { EffectScene } from '../../models/EffectScene.ts';
import { createRandom } from '../createRandom.ts';
import { glowSprite } from '../glowSprite.ts';
import { intensityScale } from '../intensityScale.ts';

type Speck = { x: number; y: number; phase: number; size: number };

const COLOR = '#f6ead6';
const FAR_COUNT = 60;
const NEAR_COUNT = 7;

function createSpecks({
  random,
  count,
  size,
}: {
  random: () => number;
  count: number;
  size: readonly [number, number];
}): ReadonlyArray<Speck> {
  return Array.from({ length: count }, () => ({
    x: random(),
    y: random(),
    phase: random() * Math.PI * 2,
    size: size[0] + random() * size[1],
  }));
}

function placeSpeck({
  scene,
  speck,
  reach,
  speed,
}: {
  scene: EffectScene;
  speck: Speck;
  reach: number;
  speed: number;
}) {
  const { seconds, width, height } = scene;
  const across =
    (speck.x +
      Math.sin(seconds * speed + speck.phase) * reach +
      seconds * 0.004) %
    1;
  const down =
    speck.y + Math.cos(seconds * speed * 0.8 + speck.phase * 1.3) * reach;

  return { x: across * width, y: down * height };
}

export function createDustPainter({
  effect,
  seed,
}: {
  effect: CanvasEffect;
  seed: number;
}): EffectPainter {
  const random = createRandom(seed);
  const scale = intensityScale(effect.intensity);
  const far = createSpecks({
    random,
    count: Math.round(FAR_COUNT * scale),
    size: [0.5, 1.2],
  });
  const near = createSpecks({
    random,
    count: Math.round(NEAR_COUNT * scale),
    size: [6, 9],
  });

  return {
    back: (scene) => {
      const { context, seconds, unit } = scene;
      const sprite = glowSprite({ color: COLOR });

      for (const speck of far) {
        const { x, y } = placeSpeck({ scene, speck, reach: 0.02, speed: 0.25 });
        const radius = speck.size * unit;
        context.globalAlpha = 0.4 + 0.4 * Math.sin(seconds * 1.5 + speck.phase);
        context.drawImage(
          sprite,
          x - radius * 2,
          y - radius * 2,
          radius * 4,
          radius * 4,
        );
      }

      context.globalAlpha = 1;
    },
    front: (scene) => {
      const { context, unit } = scene;
      const sprite = glowSprite({ color: COLOR, isSoft: true });
      context.globalAlpha = 0.18;

      for (const speck of near) {
        const { x, y } = placeSpeck({ scene, speck, reach: 0.05, speed: 0.12 });
        const radius = speck.size * unit;
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
