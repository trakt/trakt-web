import type { CanvasEffect } from '../../models/CanvasEffect.ts';
import type { EffectPainter } from '../../models/EffectPainter.ts';
import type { EffectScene } from '../../models/EffectScene.ts';
import { createFractalNoise } from '../createFractalNoise.ts';
import { createNoise2d } from '../createNoise2d.ts';
import { createRandom } from '../createRandom.ts';
import { drawSprite } from '../drawSprite.ts';
import { emberPalette } from '../emberPalette.ts';
import { loadImage } from '../loadImage.ts';
import { radialSprite } from '../radialSprite.ts';

type CreateEmbersPainterParams = {
  effect: CanvasEffect;
  seed: number;
  backdrop: string | null;
};

type ViewBox = { x: number; y: number; width: number; height: number };

type Ember = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  isNear: boolean;
  phase: number;
  rate: number;
};

type Simulation = {
  embers: ReadonlyArray<Ember>;
  pending: number;
  seconds: number | null;
};

const VIEW_WIDTH = 300;
const VIEW_HEIGHT = 450;
const SPAWN_RATE = 17;
const NEAR_SHARE = 0.05;
const CURL_STEP = 2;
const CURL_STRENGTH = 2300;
const LIFT = 44;
const WARMUP_SECONDS = 6;
const WARMUP_STEP = 1 / 30;
const MAX_STEP = 1 / 50;
const MAX_FRAME = 1 / 15;
const HAZE_TOP = 0.6;
const HAZE_STRIP = 2.5;
const HAZE_OVERLAP = 0.6;
const HAZE_AMPLITUDE = 1.6;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const smoothstep = (from: number, to: number, value: number) => {
  const amount = clamp((value - from) / (to - from));
  return amount * amount * (3 - 2 * amount);
};

const toViewBox = ([x, y, width, height]: CanvasEffect['box']): ViewBox => ({
  x: (x / 100) * VIEW_WIDTH,
  y: (y / 100) * VIEW_HEIGHT,
  width: (width / 100) * VIEW_WIDTH,
  height: (height / 100) * VIEW_HEIGHT,
});

function createAirField(seed: number) {
  const coarse = createNoise2d(seed + 11);
  const fine = createNoise2d(seed + 23);
  const stream = (x: number, y: number, t: number) =>
    coarse(x * 0.011, y * 0.011 + t * 0.22) +
    0.45 * fine(x * 0.027 - t * 0.13, y * 0.027 + t * 0.4);

  return (x: number, y: number, t: number) => ({
    x:
      (stream(x, y + CURL_STEP, t) - stream(x, y - CURL_STEP, t)) /
      (2 * CURL_STEP),
    y:
      -(stream(x + CURL_STEP, y, t) - stream(x - CURL_STEP, y, t)) /
      (2 * CURL_STEP),
  });
}

function spawnEmber(box: ViewBox, random: () => number): Ember {
  const isNear = random() < NEAR_SHARE;

  return {
    x: box.x + box.width * (0.03 + 0.94 * random()),
    y: box.y + box.height * (0.95 + 0.08 * random()),
    vx: 0,
    vy: 0,
    age: 0,
    life: isNear ? 3 + random() : 3.5 + random() * 3,
    size: isNear ? 2.4 + random() * 1.2 : 0.55 + random() * 0.6,
    isNear,
    phase: random() * Math.PI * 2,
    rate: 6 + random() * 10,
  };
}

function createSimulation({
  effect,
  seed,
}: Pick<CreateEmbersPainterParams, 'effect' | 'seed'>) {
  const random = createRandom(seed);
  const air = createAirField(seed);
  const box = toViewBox(effect.box);
  const rate = SPAWN_RATE * (0.5 + effect.intensity);
  const state: Simulation = { embers: [], pending: 0, seconds: null };

  const moveEmber = (ember: Ember, step: number, t: number): Ember => {
    const height = clamp((box.y + box.height - ember.y) / box.height);
    const flow = air(ember.x, ember.y, t);
    const lift = 0.45 + 0.7 * height;
    const speed = ember.isNear ? 1.5 : 1;
    const vx = flow.x * CURL_STRENGTH * lift * speed;
    const vy =
      (flow.y * CURL_STRENGTH * lift - LIFT * (1 - 0.35 * height)) * speed;

    return {
      ...ember,
      vx,
      vy,
      x: ember.x + vx * step,
      y: ember.y + vy * step,
      age: ember.age + step,
    };
  };

  const simulate = (step: number, t: number) => {
    const pending = state.pending + step * rate;
    const spawned = Array.from({ length: Math.floor(pending) }, () =>
      spawnEmber(box, random),
    );
    state.pending = pending - spawned.length;
    state.embers = [...state.embers, ...spawned]
      .map((ember) => moveEmber(ember, step, t))
      .filter(({ age, life, y }) => age <= life && y >= -30);
  };

  const advance = (seconds: number) => {
    if (state.seconds === seconds) return;

    if (state.seconds === null) {
      const steps = Math.round(WARMUP_SECONDS / WARMUP_STEP);
      for (let index = 0; index < steps; index++) {
        simulate(WARMUP_STEP, seconds - WARMUP_SECONDS + index * WARMUP_STEP);
      }
      state.seconds = seconds;
      return;
    }

    const elapsed = Math.min(MAX_FRAME, Math.max(0, seconds - state.seconds));
    const steps = Math.ceil(elapsed / MAX_STEP);
    for (let index = 1; index <= steps; index++) {
      simulate(elapsed / steps, state.seconds + (elapsed / steps) * index);
    }
    state.seconds = seconds;
  };

  return { advance, embers: () => state.embers, box };
}

function createHaze({
  effect,
  backdrop,
}: Pick<CreateEmbersPainterParams, 'effect' | 'backdrop'>) {
  const box = toViewBox(effect.box);
  const state: { image: HTMLImageElement | null; isLoading: boolean } = {
    image: null,
    isLoading: false,
  };

  const resolveImage = () => {
    if (!backdrop || state.isLoading) return state.image;

    state.isLoading = true;
    loadImage({ src: backdrop, crossOrigin: 'anonymous' }).then(
      (image) => {
        state.image = image.naturalWidth > 0 ? image : null;
      },
      () => {
        state.image = null;
      },
    );
    return null;
  };

  return ({ context, width, height, unit, seconds }: EffectScene) => {
    const image = resolveImage();
    if (!image) return;

    const scale = Math.max(
      width / image.naturalWidth,
      height / image.naturalHeight,
    );
    const offsetX = (width - image.naturalWidth * scale) / 2;
    const offsetY = (height - image.naturalHeight * scale) / 2;
    const top = (box.y + box.height * HAZE_TOP) * unit;
    const bottom = (box.y + box.height) * unit;
    const left = box.x * unit;
    const stripWidth = box.width * unit;
    const stripHeight = HAZE_STRIP + HAZE_OVERLAP;
    const strips = Math.ceil((bottom - top) / HAZE_STRIP);

    for (let index = 0; index < strips; index++) {
      const y = top + index * HAZE_STRIP;
      const depth = (y - top) / (bottom - top);
      const amplitude = depth * depth * HAZE_AMPLITUDE * unit;
      const row = y / unit;
      const dx =
        amplitude *
        (Math.sin(row * 0.19 - seconds * 6.1) * 0.6 +
          Math.sin(row * 0.053 + seconds * 3.7) * 0.4);
      const dy = amplitude * 0.5 * Math.sin(row * 0.11 - seconds * 4.3);

      context.drawImage(
        image,
        (left - offsetX) / scale,
        (y + dy - offsetY) / scale,
        stripWidth / scale,
        stripHeight / scale,
        left + dx,
        y,
        stripWidth,
        stripHeight,
      );
    }
  };
}

export function createEmbersPainter({
  effect,
  seed,
  backdrop,
}: CreateEmbersPainterParams): EffectPainter {
  const palette = emberPalette(effect.color);
  const glow = createFractalNoise(seed + 7);
  const simulation = createSimulation({ effect, seed });
  const { box } = simulation;

  const paintBaseGlow = ({ context, unit, seconds }: EffectScene) => {
    drawSprite({
      context,
      sprite: radialSprite({ color: palette(0.55), profile: 'soft' }),
      x: (box.x + box.width / 2) * unit,
      y: (box.y + box.height) * unit,
      width: box.width * 1.25 * unit,
      height: box.height * 0.5 * unit,
      alpha: (0.07 + 0.045 * glow(seconds * 1.6)) * (0.6 + effect.intensity),
    });
  };

  const paintEmbers = (scene: EffectScene, isNear: boolean) => {
    const { context, unit, seconds } = scene;
    simulation.advance(seconds);
    const base = context.getTransform();

    for (const ember of simulation.embers()) {
      if (ember.isNear !== isNear) continue;

      const progress = ember.age / ember.life;
      const heat = 1 - progress ** 1.2 * 0.92;
      const fade =
        smoothstep(0, 0.06, progress) *
        (1 - smoothstep(0.82, 1, progress)) *
        (0.72 + 0.28 * Math.sin(seconds * ember.rate + ember.phase));
      if (fade < 0.01) continue;

      const size = ember.size * unit * (2.6 + 2.6 * heat);
      const speed = Math.hypot(ember.vx, ember.vy);
      context.setTransform(base);
      context.translate(ember.x * unit, ember.y * unit);
      context.rotate(Math.atan2(ember.vy, ember.vx) - Math.PI / 2);
      drawSprite({
        context,
        sprite: radialSprite({
          color: palette(heat),
          profile: isNear ? 'soft' : 'core',
        }),
        x: 0,
        y: 0,
        width: size,
        height: size * (1 + speed * 0.012),
        alpha: fade * (isNear ? 0.5 : 1),
      });
    }

    context.setTransform(base);
  };

  return {
    backdrop: createHaze({ effect, backdrop }),
    back: (scene) => {
      paintBaseGlow(scene);
      paintEmbers(scene, false);
    },
    front: (scene) => paintEmbers(scene, true),
  };
}
