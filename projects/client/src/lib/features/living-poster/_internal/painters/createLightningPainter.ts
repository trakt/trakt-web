import type { CanvasEffect } from '../../models/CanvasEffect.ts';
import type { EffectPainter } from '../../models/EffectPainter.ts';
import type { Rgb } from '../../models/Rgb.ts';
import { cloudTexture } from '../cloudTexture.ts';
import { createRandom } from '../createRandom.ts';
import { drawSprite } from '../drawSprite.ts';
import { loadImage } from '../loadImage.ts';
import { radialSprite } from '../radialSprite.ts';

type Point = readonly [x: number, y: number];

type Strike = {
  at: number;
  isFar: boolean;
  offsets: ReadonlyArray<number>;
  amplitudes: ReadonlyArray<number>;
  centerX: number;
  bolt: ReadonlyArray<ReadonlyArray<number>> | null;
};

type StrikePlan = {
  strikes: ReadonlyArray<Strike>;
  period: number;
};

type SubdivideParams = {
  random: () => number;
  from: Point;
  to: Point;
  spread: number;
  depth: number;
};

const STRIKES = 36;
const FIRST_STRIKE = 1.2;
const STRIKE_SECONDS = 1.4;
const RISE_SECONDS = 0.012;
const DECAY_SECONDS = 0.065;
const AFTERGLOW = 0.12;
const AFTERGLOW_SECONDS = 0.45;
const FAR_LEVEL = 0.35;
const BOLT_SECONDS = 0.12;
const DARK = 0.003;
const SKY: Rgb = [200, 214, 255];
const CLOUDS: Rgb = [210, 220, 255];
const SKY_SIZE = 128;
const RIM_WIDTH = 300;
const RIM_HEIGHT = 450;
const BOLT_STROKES: ReadonlyArray<
  readonly [width: number, alpha: number, color: string]
> = [
  [6, 0.07, 'rgb(200, 215, 255)'],
  [2.4, 0.22, 'rgb(225, 233, 255)'],
  [0.9, 0.95, '#ffffff'],
];

function subdivide({
  random,
  from,
  to,
  spread,
  depth,
}: SubdivideParams): ReadonlyArray<number> {
  if (depth === 0) return to;

  const middle: Point = [
    (from[0] + to[0]) / 2 + (random() - 0.5) * spread,
    (from[1] + to[1]) / 2 + (random() - 0.5) * spread * 0.3,
  ];
  const half = { random, spread: spread / 2, depth: depth - 1 };

  return [
    ...subdivide({ ...half, from, to: middle }),
    ...subdivide({ ...half, from: middle, to }),
  ];
}

function createBolt(random: () => number, centerX: number) {
  const start: Point = [centerX + (random() - 0.5) * 0.1, -0.02];
  const end: Point = [
    centerX + (random() - 0.5) * 0.25,
    0.28 + random() * 0.22,
  ];
  const main = [
    ...start,
    ...subdivide({ random, from: start, to: end, spread: 0.14, depth: 5 }),
  ];
  const branches = Array.from({ length: 1 + Math.floor(random() * 2) }, () => {
    const at = 2 * (4 + Math.floor(random() * (main.length / 2 - 10)));
    const fork: Point = [main[at] ?? start[0], main[at + 1] ?? start[1]];
    const tip: Point = [
      fork[0] + (random() - 0.5) * 0.3,
      fork[1] + 0.08 + random() * 0.12,
    ];

    return [
      ...fork,
      ...subdivide({ random, from: fork, to: tip, spread: 0.07, depth: 4 }),
    ];
  });

  return [main, ...branches];
}

function planStrikes(random: () => number): StrikePlan {
  const clock = { at: FIRST_STRIKE };

  const strikes = Array.from({ length: STRIKES }, (): Strike => {
    const isFar = random() < 0.3;
    const strokes = isFar
      ? 1 + Math.floor(random() * 2)
      : 2 + Math.floor(random() * 3);
    const offsets = Array.from({ length: strokes - 1 }).reduce<
      ReadonlyArray<number>
    >((acc) => [...acc, (acc.at(-1) ?? 0) + 0.05 + random() * 0.11], [0]);
    const amplitudes = offsets.map((_, index) =>
      index === 0 ? 1 : 0.55 + random() * 0.45,
    );
    const centerX = 0.15 + random() * 0.7;
    const bolt = !isFar && random() < 0.6 ? createBolt(random, centerX) : null;
    const strike = { at: clock.at, isFar, offsets, amplitudes, centerX, bolt };
    clock.at += 3.8 + random() * 5.5;

    return strike;
  });

  return { strikes, period: clock.at };
}

function strikeLevel(strike: Strike, age: number) {
  const strokes = strike.offsets.map((offset, index) => {
    const since = age - offset;
    if (since < 0) return 0;

    const shape =
      since < RISE_SECONDS
        ? since / RISE_SECONDS
        : Math.exp(-(since - RISE_SECONDS) / DECAY_SECONDS);
    return shape * (strike.amplitudes[index] ?? 0);
  });
  const level = Math.max(
    AFTERGLOW * Math.exp(-age / AFTERGLOW_SECONDS),
    ...strokes,
  );

  return strike.isFar ? level * FAR_LEVEL : level;
}

function findFlash({ strikes, period }: StrikePlan, seconds: number) {
  const local = seconds % period;
  const strike = strikes.find(
    ({ at }) => local >= at && local < at + STRIKE_SECONDS,
  );
  if (!strike) return null;

  const age = local - strike.at;
  return { strike, age, level: strikeLevel(strike, age) };
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  return context ? { canvas, context } : null;
}

function createSkyTexture(seed: number) {
  const sky = createCanvas(SKY_SIZE, SKY_SIZE);
  if (!sky) return null;

  const { canvas, context } = sky;
  context.drawImage(
    cloudTexture({
      seed: (seed % 997) + 3,
      color: CLOUDS,
      from: 0.32,
      to: 0.95,
    }),
    0,
    0,
  );
  context.globalCompositeOperation = 'destination-in';
  const fade = context.createLinearGradient(0, 0, 0, SKY_SIZE);
  fade.addColorStop(0, 'rgba(0, 0, 0, 1)');
  fade.addColorStop(0.55, 'rgba(0, 0, 0, 0.6)');
  fade.addColorStop(1, 'rgba(0, 0, 0, 0)');
  context.fillStyle = fade;
  context.fillRect(0, 0, SKY_SIZE, SKY_SIZE);

  return canvas;
}

function createRim(figures: HTMLImageElement) {
  const edge = createCanvas(RIM_WIDTH, RIM_HEIGHT);
  const rim = createCanvas(RIM_WIDTH, RIM_HEIGHT);
  if (!edge || !rim) return null;

  edge.context.drawImage(figures, 0, 0, RIM_WIDTH, RIM_HEIGHT);
  edge.context.globalCompositeOperation = 'source-in';
  edge.context.fillStyle = 'rgb(214, 224, 255)';
  edge.context.fillRect(0, 0, RIM_WIDTH, RIM_HEIGHT);
  edge.context.globalCompositeOperation = 'destination-out';
  edge.context.drawImage(figures, 1.2, 3.4, RIM_WIDTH, RIM_HEIGHT);
  rim.context.filter = 'blur(0.8px)';
  rim.context.drawImage(edge.canvas, 0, 0);

  return rim.canvas;
}

function drawBolt({
  context,
  bolt,
  lit,
  width,
  height,
  unit,
}: {
  context: CanvasRenderingContext2D;
  bolt: ReadonlyArray<ReadonlyArray<number>>;
  lit: number;
  width: number;
  height: number;
  unit: number;
}) {
  context.lineJoin = 'round';
  context.lineCap = 'round';

  for (const [strokeWidth, alpha, color] of BOLT_STROKES) {
    context.strokeStyle = color;
    context.globalAlpha = Math.min(1, lit * alpha);

    bolt.forEach((line, index) => {
      context.lineWidth = strokeWidth * unit * (index === 0 ? 1 : 0.6);
      context.beginPath();
      context.moveTo((line[0] ?? 0) * width, (line[1] ?? 0) * height);
      for (let point = 2; point < line.length; point += 2) {
        context.lineTo(
          (line[point] ?? 0) * width,
          (line[point + 1] ?? 0) * height,
        );
      }
      context.stroke();
    });
  }
}

export function createLightningPainter({
  effect,
  seed,
  figures,
}: {
  effect: CanvasEffect;
  seed: number;
  figures: string | null;
}): EffectPainter {
  const plan = planStrikes(createRandom(seed));
  const strength = effect.intensity * 2;
  const assets: {
    sky?: HTMLCanvasElement | null;
    rim: HTMLCanvasElement | null;
    isRimRequested: boolean;
  } = { rim: null, isRimRequested: false };

  const flashAt = (seconds: number) => {
    const flash = findFlash(plan, seconds);
    if (!flash) return null;

    const lit = flash.level * strength;
    return lit < DARK ? null : { ...flash, lit };
  };

  const resolveRim = () => {
    if (figures && !assets.isRimRequested) {
      assets.isRimRequested = true;
      loadImage({ src: figures })
        .then(createRim, () => null)
        .then((rim) => {
          assets.rim = rim;
        });
    }

    return assets.rim;
  };

  return {
    back: ({ context, width, height, unit, seconds }) => {
      const flash = flashAt(seconds);
      if (!flash) return;

      const { strike, age, lit } = flash;
      assets.sky ??= createSkyTexture(seed);
      if (assets.sky) {
        context.globalAlpha = Math.min(1, lit * 0.55);
        context.drawImage(assets.sky, 0, 0, width, height * 0.7);
      }
      drawSprite({
        context,
        sprite: radialSprite({ color: SKY, profile: 'soft' }),
        x: strike.centerX * width,
        y: (strike.isFar ? 0.3 : 0.1) * height,
        width: width * 1.6,
        height: height * 1.1,
        alpha: lit * 0.7,
      });

      const wash = context.createLinearGradient(0, 0, 0, height * 0.75);
      wash.addColorStop(0, 'rgba(190, 205, 255, 0.35)');
      wash.addColorStop(1, 'rgba(190, 205, 255, 0)');
      context.globalAlpha = Math.min(1, lit);
      context.fillStyle = wash;
      context.fillRect(0, 0, width, height * 0.75);

      const lastStroke = strike.offsets.at(-1) ?? 0;
      if (!strike.bolt || age > lastStroke + BOLT_SECONDS) return;

      drawBolt({ context, bolt: strike.bolt, lit, width, height, unit });
    },
    rim: ({ context, width, height, seconds }) => {
      const rim = resolveRim();
      const flash = flashAt(seconds);
      if (!rim || !flash || flash.strike.isFar) return;

      context.globalAlpha = Math.min(1, flash.lit * 0.95);
      context.drawImage(rim, 0, 0, width, height);
    },
    front: ({ context, width, height, seconds, setPlaneFilter }) => {
      const flash = flashAt(seconds);
      setPlaneFilter(
        flash
          ? `brightness(${1 + flash.lit * 0.6}) saturate(${1 - flash.level * 0.3})`
          : '',
      );
      if (!flash) return;

      context.globalAlpha = Math.min(1, flash.lit * 0.05);
      context.fillStyle = 'rgb(205, 218, 255)';
      context.fillRect(0, 0, width, height);
    },
  };
}
