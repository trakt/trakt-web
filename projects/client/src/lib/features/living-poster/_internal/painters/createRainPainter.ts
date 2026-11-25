import type { CanvasEffect } from '../../models/CanvasEffect.ts';
import type { EffectPainter } from '../../models/EffectPainter.ts';
import type { EffectScene } from '../../models/EffectScene.ts';
import { createRandom } from '../createRandom.ts';
import { intensityScale } from '../intensityScale.ts';

type Splash = { x: number; y: number; at: number; size: number };

const DROP_COUNT = 60;
const SPLASH_EVERY = 0.045;
const SPLASH_SECONDS = 0.5;
const MAX_CATCH_UP = 1;

function createDrops(random: () => number, scale: number) {
  return Array.from({ length: Math.round(DROP_COUNT * scale) }, () => ({
    x: random() * 110 - 5,
    phase: random(),
    duration: 0.6 + random() * 0.35,
    length: 0.05 + random() * 0.05,
    opacity: 0.2 + random() * 0.3,
  }));
}

function drawSplash(scene: EffectScene, splash: Splash) {
  const { context, seconds, width, height, unit } = scene;
  const age = (seconds - splash.at) / SPLASH_SECONDS;
  if (age < 0) return;

  const x = splash.x * width;
  const y = splash.y * height;
  const ring = (3 + age * 10) * splash.size * unit;
  context.strokeStyle = `rgba(215, 228, 255, ${0.45 * (1 - age)})`;
  context.lineWidth = 0.8 * unit;
  context.beginPath();
  context.ellipse(x, y, ring, ring * 0.3, 0, 0, Math.PI * 2);
  context.stroke();

  if (age >= 0.4) return;

  const hop = age / 0.4;
  context.fillStyle = `rgba(225, 235, 255, ${0.6 * (1 - hop)})`;
  for (const side of [-1, 1]) {
    context.beginPath();
    context.arc(
      x + side * hop * 7 * splash.size * unit,
      y - Math.sin(hop * Math.PI) * 8 * splash.size * unit,
      0.9 * unit,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
}

export function createRainPainter({
  effect,
  seed,
}: {
  effect: CanvasEffect;
  seed: number;
}): EffectPainter {
  const random = createRandom(seed);
  const scale = intensityScale(effect.intensity);
  const drops = createDrops(random, scale);
  const splashEvery = SPLASH_EVERY / scale;
  const splashes = { live: [] as ReadonlyArray<Splash>, last: 0 };

  const spawnSplashes = (seconds: number) => {
    splashes.last = Math.max(splashes.last, seconds - MAX_CATCH_UP);
    const spawned: Array<Splash> = [];

    while (splashes.last < seconds) {
      splashes.last += splashEvery;
      spawned.push({
        x: random(),
        y: 0.82 + random() * 0.16,
        at: splashes.last,
        size: 0.6 + random() * 0.8,
      });
    }

    splashes.live = [...splashes.live, ...spawned].filter(
      ({ at }) => seconds - at < SPLASH_SECONDS,
    );
  };

  return {
    back: ({ context, seconds, width, height, unit }) => {
      context.lineWidth = 0.9 * unit;

      for (const drop of drops) {
        const progress = (seconds / drop.duration + drop.phase) % 1;
        const y = (progress * 1.25 - 0.15) * height;
        const x = (drop.x / 100) * width - progress * 0.1 * height;
        const length = drop.length * height;
        const streak = context.createLinearGradient(
          x + 0.1 * length,
          y - length,
          x,
          y,
        );
        streak.addColorStop(0, 'rgba(210, 225, 255, 0)');
        streak.addColorStop(1, `rgba(220, 232, 255, ${drop.opacity})`);
        context.strokeStyle = streak;
        context.beginPath();
        context.moveTo(x + 0.1 * length, y - length);
        context.lineTo(x, y);
        context.stroke();
      }
    },
    front: (scene) => {
      const { context, seconds, width, height } = scene;
      spawnSplashes(seconds);
      for (const splash of splashes.live) drawSplash(scene, splash);

      const mist = context.createLinearGradient(0, height * 0.75, 0, height);
      mist.addColorStop(0, 'rgba(200, 215, 240, 0)');
      mist.addColorStop(1, 'rgba(200, 215, 240, 0.12)');
      context.fillStyle = mist;
      context.fillRect(0, height * 0.75, width, height * 0.25);
    },
  };
}
