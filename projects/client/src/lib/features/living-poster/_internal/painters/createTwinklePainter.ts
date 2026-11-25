import type { CanvasEffect } from '../../models/CanvasEffect.ts';
import type { EffectPainter } from '../../models/EffectPainter.ts';
import type { Rgb } from '../../models/Rgb.ts';
import { createFractalNoise } from '../createFractalNoise.ts';
import { createRandom } from '../createRandom.ts';
import { drawSprite } from '../drawSprite.ts';
import { intensityScale } from '../intensityScale.ts';
import { radialSprite } from '../radialSprite.ts';
import { sampleLuminance } from '../sampleLuminance.ts';

type Luminance = (x: number, y: number) => number;

type Star = {
  x: number;
  y: number;
  magnitude: number;
  size: number;
  phase: number;
  scintillation: (position: number) => number;
  rate: number;
  turn: number;
  tint: Rgb;
  isSpiky: boolean;
};

type PlaceStarsParams = {
  box: CanvasEffect['box'];
  count: number;
  seed: number;
  random: () => number;
  luminance: Luminance | null;
};

const COUNT = 28;
const CANDIDATES = 7;
const SPIKY_COUNT = 3;
const BRIGHT_SKY = 0.7;
const SAMPLE_WAIT_SECONDS = 1.5;
const WHITE: Rgb = [255, 255, 255];
const COOL: Rgb = [200, 215, 255];
const WARM: Rgb = [255, 234, 206];
const SPIKE_SIZE = 128;

const spikes: { sprite?: HTMLCanvasElement } = {};

function createSpikeSprite() {
  const sprite = document.createElement('canvas');
  sprite.width = SPIKE_SIZE;
  sprite.height = SPIKE_SIZE;

  const context = sprite.getContext('2d');
  if (!context) return sprite;

  const half = SPIKE_SIZE / 2;
  for (const turn of [0, Math.PI / 2]) {
    context.save();
    context.translate(half, half);
    context.rotate(turn);
    context.scale(1, 0.04);
    const ray = context.createRadialGradient(0, 0, 0, 0, 0, half);
    ray.addColorStop(0, 'rgba(255, 255, 255, 1)');
    ray.addColorStop(0.25, 'rgba(255, 255, 255, 0.35)');
    ray.addColorStop(1, 'rgba(255, 255, 255, 0)');
    context.fillStyle = ray;
    context.fillRect(-half, -half, SPIKE_SIZE, SPIKE_SIZE);
    context.restore();
  }

  return sprite;
}

function spikeSprite() {
  spikes.sprite ??= createSpikeSprite();
  return spikes.sprite;
}

const mixRgb = (from: Rgb, to: Rgb, amount: number): Rgb => [
  Math.round(from[0] + (to[0] - from[0]) * amount),
  Math.round(from[1] + (to[1] - from[1]) * amount),
  Math.round(from[2] + (to[2] - from[2]) * amount),
];

function placeStars({
  box,
  count,
  seed,
  random,
  luminance,
}: PlaceStarsParams): ReadonlyArray<Star> {
  const [boxX, boxY, boxWidth, boxHeight] = box;

  const stars = Array.from({ length: count }, (_, index) => index).flatMap(
    (index): ReadonlyArray<Omit<Star, 'isSpiky'>> => {
      const candidates = Array.from(
        { length: luminance ? CANDIDATES : 1 },
        () => {
          const x = (boxX + random() * boxWidth) / 100;
          const y = (boxY + random() * boxHeight) / 100;
          return { x, y, level: luminance?.(x, y) ?? 0 };
        },
      );
      const darkest = candidates.reduce((best, candidate) =>
        candidate.level < best.level ? candidate : best,
      );
      const magnitude = random() ** 3;
      const star = {
        x: darkest.x,
        y: darkest.y,
        magnitude,
        size: 0.7 + 3.2 * magnitude,
        phase: random() * Math.PI * 2,
        scintillation: createFractalNoise(seed + index * 17),
        rate: 2 + random() * 3,
        turn: 0.3 + random() * 0.4,
        tint: mixRgb(WHITE, random() < 0.5 ? COOL : WARM, 0.5),
      };
      const isHidden = luminance !== null && darkest.level > BRIGHT_SKY;

      return isHidden ? [] : [star];
    },
  );

  return stars
    .toSorted((a, b) => b.magnitude - a.magnitude)
    .map((star, index) => ({
      ...star,
      isSpiky: index < SPIKY_COUNT,
    }));
}

export function createTwinklePainter({
  effect,
  seed,
  backdrop,
}: {
  effect: CanvasEffect;
  seed: number;
  backdrop: string | null;
}): EffectPainter {
  const random = createRandom(seed);
  const sky: {
    sampling: Promise<void> | null;
    luminance: Luminance | null;
    isSampled: boolean;
    stars: ReadonlyArray<Star> | null;
  } = { sampling: null, luminance: null, isSampled: !backdrop, stars: null };

  const resolveStars = (seconds: number) => {
    if (sky.stars) return sky.stars;

    if (backdrop && !sky.sampling) {
      sky.sampling = sampleLuminance(backdrop).then((luminance) => {
        sky.luminance = luminance;
        sky.isSampled = true;
      });
    }
    if (!sky.isSampled && seconds < SAMPLE_WAIT_SECONDS) return null;

    sky.stars = placeStars({
      box: effect.box,
      count: Math.round(COUNT * intensityScale(effect.intensity)),
      seed,
      random,
      luminance: sky.luminance,
    });
    return sky.stars;
  };

  return {
    back: ({ context, width, height, unit, seconds }) => {
      const stars = resolveStars(seconds);
      if (!stars) return;

      for (const star of stars) {
        const flicker =
          0.72 + 0.4 * star.scintillation(seconds * star.rate + star.phase);
        const brightness =
          (0.5 + 0.5 * star.magnitude) * Math.min(1, Math.max(0, flicker));
        const x = star.x * width;
        const y = star.y * height;

        drawSprite({
          context,
          sprite: radialSprite({ color: star.tint, profile: 'soft' }),
          x,
          y,
          width: star.size * unit * 7,
          alpha: brightness * 0.3,
        });
        drawSprite({
          context,
          sprite: radialSprite({ color: star.tint, profile: 'core' }),
          x,
          y,
          width: star.size * unit * 3.2,
          alpha: brightness,
        });
        if (!star.isSpiky) continue;

        const pulse = Math.max(0, Math.sin(seconds * 0.45 + star.phase)) ** 4;
        context.save();
        context.translate(x, y);
        context.rotate(star.turn + seconds * 0.01);
        drawSprite({
          context,
          sprite: spikeSprite(),
          x: 0,
          y: 0,
          width: (10 + star.size * 7) * unit * (0.5 + 0.7 * pulse),
          alpha: brightness * (0.3 + 0.5 * pulse),
        });
        context.restore();
      }
    },
  };
}
