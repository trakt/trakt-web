import { seededRandom } from '../shared/seededRandom.ts';
import type { PaintParams } from './PaintParams.ts';

type Ridge = {
  base: number;
  amplitude: number;
  waves: ReadonlyArray<readonly [number, number, number]>;
  fill: readonly [string, string];
  rim: string;
};

const RIDGES: ReadonlyArray<Ridge> = [
  {
    base: 0.6,
    amplitude: 0.05,
    waves: [
      [1.3, 0.4, 1],
      [3.1, 1.7, 0.35],
      [6.2, 0.2, 0.12],
    ],
    fill: ['#2a1a0e', '#160e08'],
    rim: 'rgba(240, 186, 110, 0.32)',
  },
  {
    base: 0.72,
    amplitude: 0.07,
    waves: [
      [0.9, 2.1, 1],
      [2.4, 0.6, 0.45],
      [5.3, 1.1, 0.12],
    ],
    fill: ['#24160b', '#110a05'],
    rim: 'rgba(255, 200, 120, 0.42)',
  },
  {
    base: 0.86,
    amplitude: 0.08,
    waves: [
      [0.7, 4.2, 1],
      [1.9, 2.9, 0.5],
      [4.4, 0.3, 0.15],
    ],
    fill: ['#1c1108', '#0b0704'],
    rim: 'rgba(255, 214, 150, 0.5)',
  },
];

type RidgeYParams = {
  ridge: Ridge;
  x: number;
  width: number;
  height: number;
};

const ridgeY = ({ ridge, x, width, height }: RidgeYParams) => {
  const u = (x / width) * Math.PI * 2;
  const wave = ridge.waves.reduce(
    (sum, [frequency, phase, weight]) =>
      sum + Math.sin(u * frequency + phase) * weight,
    0,
  );
  return height * (ridge.base - ridge.amplitude * wave * 0.6);
};

type RidgePointsParams = Omit<RidgeYParams, 'x'>;

const ridgePoints = ({ ridge, width, height }: RidgePointsParams) =>
  Array.from({ length: 97 }, (_, index) => {
    const x = (index / 96) * width;
    return [x, ridgeY({ ridge, x, width, height })] as const;
  });

function paintSky({ ctx, width, height }: PaintParams) {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#0d0907');
  sky.addColorStop(0.45, '#1a110a');
  sky.addColorStop(0.62, '#3a2312');
  sky.addColorStop(0.75, '#1a1009');
  sky.addColorStop(1, '#0a0604');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const sun = ctx.createRadialGradient(
    width * 0.2,
    height * 0.6,
    0,
    width * 0.2,
    height * 0.6,
    height * 0.55,
  );
  sun.addColorStop(0, 'rgba(255, 214, 150, 0.34)');
  sun.addColorStop(0.08, 'rgba(255, 180, 100, 0.22)');
  sun.addColorStop(0.4, 'rgba(200, 110, 50, 0.08)');
  sun.addColorStop(1, 'rgba(120, 60, 20, 0)');
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, width, height);

  const spice = ctx.createRadialGradient(
    width * 0.1,
    height * 0.12,
    0,
    width * 0.1,
    height * 0.12,
    height * 0.5,
  );
  spice.addColorStop(0, 'rgba(70, 120, 220, 0.12)');
  spice.addColorStop(1, 'rgba(70, 120, 220, 0)');
  ctx.fillStyle = spice;
  ctx.fillRect(0, 0, width, height);
}

function paintStars({ ctx, width, height }: PaintParams) {
  const random = seededRandom(1812);
  Array.from({ length: Math.round((width * height) / 9000) }).forEach(() => {
    const x = random() * width;
    const y = random() * height * 0.5;
    ctx.fillStyle = `rgba(255, 236, 210, ${0.08 + random() * 0.28})`;
    ctx.fillRect(x, y, random() > 0.9 ? 1.6 : 1, random() > 0.9 ? 1.6 : 1);
  });
}

type PaintRidgeParams = PaintParams & { ridge: Ridge; index: number };

function paintRidge({ ctx, width, height, ridge, index }: PaintRidgeParams) {
  const points = ridgePoints({ ridge, width, height });
  const top = Math.min(...points.map(([, y]) => y));

  ctx.beginPath();
  ctx.moveTo(0, height);
  points.forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.lineTo(width, height);
  ctx.closePath();
  const fill = ctx.createLinearGradient(0, top, 0, height);
  fill.addColorStop(0, ridge.fill[0]);
  fill.addColorStop(1, ridge.fill[1]);
  ctx.fillStyle = fill;
  ctx.fill();

  ctx.save();
  ctx.clip();
  const random = seededRandom(400 + index);
  ctx.strokeStyle = 'rgba(255, 210, 150, 0.05)';
  ctx.lineWidth = 1;
  Array.from({ length: 18 + index * 10 }).forEach(() => {
    const y = top + random() * (height - top);
    const x = random() * width;
    const span = 60 + random() * 180;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + span / 2, y - 4 - random() * 6, x + span, y);
    ctx.stroke();
  });
  ctx.restore();

  const rim = ctx.createLinearGradient(0, 0, width, 0);
  rim.addColorStop(0, ridge.rim);
  rim.addColorStop(0.55, ridge.rim.replace(/[\d.]+\)$/, '0.12)'));
  rim.addColorStop(1, 'rgba(255, 200, 120, 0.04)');
  ctx.beginPath();
  points.forEach(([x, y], pointIndex) =>
    pointIndex === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y),
  );
  ctx.strokeStyle = rim;
  ctx.lineWidth = 1.4;
  ctx.stroke();
}

export function paintDesert(params: PaintParams) {
  paintSky(params);
  paintStars(params);
  RIDGES.forEach((ridge, index) => paintRidge({ ...params, ridge, index }));
}
