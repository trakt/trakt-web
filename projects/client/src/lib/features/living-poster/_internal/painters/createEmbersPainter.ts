import type { CanvasEffect } from '../../models/CanvasEffect.ts';
import type { EffectPainter } from '../../models/EffectPainter.ts';
import type { EffectScene } from '../../models/EffectScene.ts';
import { createRandom } from '../createRandom.ts';
import { emberColor } from '../emberColor.ts';
import { glowSprite } from '../glowSprite.ts';
import { interpolate } from '../interpolate.ts';
import { toPixelBox } from '../toPixelBox.ts';
import { toRgba } from '../toRgba.ts';

type CreateEmbersPainterParams = {
  effect: CanvasEffect;
  seed: number;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

type BurstSpark = Spark & { born: number; life: number };

const EMBER_COUNT = 40;
const EMBER_COLOR = '#ffa54a';
const SPARK_COUNT = 40;
const SPARKS_PER_BURST = 12;
const TRAIL = 0.06;
const GLOW_RADIUS_RATIO = 2.5;

function createEmbers(effect: CanvasEffect, random: () => number) {
  const count = Math.round(EMBER_COUNT * (0.5 + effect.intensity));

  return Array.from({ length: count }, () => ({
    x: random() * 100,
    size: 1 + random() * 1.6,
    y: 70 + random() * 40,
    dx: (random() - 0.5) * 40,
    duration: 4 + random() * 5,
    phase: random(),
  }));
}

function createSparks(random: () => number) {
  return Array.from({ length: SPARK_COUNT }, () => ({
    x: random() * 100,
    y: 70 + random() * 40,
    speed: 35 + random() * 55,
    duration: 1.2 + random() * 1.8,
    phase: random(),
    drift: (random() - 0.5) * 0.7,
    size: 0.6 + random() * 0.9,
  }));
}

function createBurst(random: () => number, seconds: number) {
  const x = 15 + random() * 70;
  const y = 80 + random() * 15;

  return Array.from({ length: SPARKS_PER_BURST }, (): BurstSpark => {
    const angle = -Math.PI / 2 + (random() - 0.5) * 1.6;
    const speed = 40 + random() * 60;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed * 0.6,
      vy: Math.sin(angle) * speed,
      born: seconds,
      life: 0.7 + random() * 0.8,
      size: 0.7 + random(),
    };
  });
}

function drawStreak({
  scene,
  box,
  spark,
  heat,
  opacity,
}: {
  scene: EffectScene;
  box: ReturnType<typeof toPixelBox>;
  spark: Spark;
  heat: number;
  opacity: number;
}) {
  const { context, unit } = scene;
  const color = emberColor(heat);
  const headX = box.x + (spark.x / 100) * box.width;
  const headY = box.y + (spark.y / 100) * box.height;
  const tailX = headX - (spark.vx * TRAIL * box.width) / 100;
  const tailY = headY - (spark.vy * TRAIL * box.height) / 100;

  const trail = context.createLinearGradient(tailX, tailY, headX, headY);
  trail.addColorStop(0, toRgba(color, 0));
  trail.addColorStop(1, toRgba(color, opacity));
  context.strokeStyle = trail;
  context.lineWidth = spark.size * unit;
  context.beginPath();
  context.moveTo(tailX, tailY);
  context.lineTo(headX, headY);
  context.stroke();

  context.fillStyle = toRgba(emberColor(heat + 0.3), opacity);
  context.beginPath();
  context.arc(headX, headY, spark.size * unit * 0.7, 0, Math.PI * 2);
  context.fill();
}

export function createEmbersPainter({
  effect,
  seed,
}: CreateEmbersPainterParams): EffectPainter {
  const random = createRandom(seed);
  const embers = createEmbers(effect, random);
  const sparks = createSparks(random);
  const color = effect.color ?? EMBER_COLOR;
  const bursts = { live: [] as ReadonlyArray<BurstSpark>, next: 1 };

  const paintEmbers = (scene: EffectScene) => {
    const { context, seconds, unit } = scene;
    const box = toPixelBox({ box: effect.box, ...scene });
    const sprite = glowSprite({ color });

    for (const ember of embers) {
      const progress = (seconds / ember.duration + ember.phase) % 1;
      const opacity = interpolate(progress, [
        [0, 0],
        [0.12, 1],
        [1, 0],
      ]);
      if (opacity <= 0.01) continue;

      const x = box.x + ((ember.x + ember.dx * progress) / 100) * box.width;
      const y = box.y + ((ember.y - 110 * progress) / 100) * box.height;
      const radius =
        ember.size * (1 - 0.6 * progress) * GLOW_RADIUS_RATIO * unit;
      context.globalAlpha = opacity;
      context.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2);
    }

    context.globalAlpha = 1;
  };

  const paintSparks = (scene: EffectScene) => {
    const { seconds } = scene;
    const box = toPixelBox({ box: effect.box, ...scene });
    scene.context.lineCap = 'round';

    for (const spark of sparks) {
      const progress = (seconds / spark.duration + spark.phase) % 1;
      const vy = -spark.speed;
      const vx = spark.drift * spark.speed;
      const travelled = progress * spark.duration;

      drawStreak({
        scene,
        box,
        spark: {
          x: spark.x + vx * travelled,
          y: spark.y + vy * travelled * 0.9,
          vx,
          vy,
          size: spark.size,
        },
        heat: 1 - progress,
        opacity: interpolate(progress, [
          [0, 0],
          [0.1, 1],
          [1, 0],
        ]),
      });
    }

    if (seconds > bursts.next) {
      bursts.live = [...bursts.live, ...createBurst(random, seconds)];
      bursts.next = seconds + 2.5 + random() * 2.5;
    }

    bursts.live = bursts.live.filter(({ born, life }) => seconds - born < life);
    for (const burst of bursts.live) {
      const age = seconds - burst.born;
      const progress = age / burst.life;

      drawStreak({
        scene,
        box,
        spark: {
          x: burst.x + burst.vx * age,
          y: burst.y + burst.vy * age + 30 * age * age,
          vx: burst.vx,
          vy: burst.vy + 60 * age,
          size: burst.size,
        },
        heat: 1 - progress * 0.9,
        opacity: 1 - progress,
      });
    }
  };

  return {
    back: (scene) => {
      paintEmbers(scene);
      paintSparks(scene);
    },
  };
}
