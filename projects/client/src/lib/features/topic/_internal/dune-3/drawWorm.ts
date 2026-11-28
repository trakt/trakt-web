import type { WormPass } from './WormPass.ts';

type Spray = { x: number; y: number; vx: number; vy: number; life: number };

type DrawWormParams = {
  context: CanvasRenderingContext2D;
  worm: WormPass;
  time: number;
  spray: Spray[];
  delta: number;
};

const STEP = 5;

const pathY = (worm: WormPass, x: number) =>
  worm.baseline +
  worm.sway * Math.sin(x / worm.wavelength) +
  worm.sway * 0.35 * Math.sin(x / (worm.wavelength * 0.37) + 1.3);

const girthAt = (worm: WormPass, distance: number) => {
  const head = 46;
  if (distance < head) return worm.girth * (0.62 + 0.38 * (distance / head));
  const tail = (distance - head) / (worm.length - head);
  return worm.girth * (1 - 0.82 * tail ** 1.25);
};

const headX = (worm: WormPass, time: number) => {
  const travelled = (time - worm.start) * worm.speed;
  return worm.direction > 0 ? -80 + travelled : worm.width + 80 - travelled;
};

const strokeBody = ({
  context,
  worm,
  head,
  lift,
  scale,
  color,
}: {
  context: CanvasRenderingContext2D;
  worm: WormPass;
  head: number;
  lift: number;
  scale: number;
  color: (fade: number) => string;
}) => {
  for (let distance = 0; distance < worm.length; distance += STEP) {
    const x0 = head - worm.direction * distance;
    const x1 = head - worm.direction * (distance + STEP);
    if (
      (x0 < -60 && x1 < -60) ||
      (x0 > worm.width + 60 && x1 > worm.width + 60)
    )
      continue;
    const girth = girthAt(worm, distance);
    const fade = 1 - (distance / worm.length) ** 2;
    context.strokeStyle = color(fade);
    context.lineWidth = Math.max(0.8, girth * scale);
    context.beginPath();
    context.moveTo(x0, pathY(worm, x0) + girth * lift);
    context.lineTo(x1, pathY(worm, x1) + girth * lift);
    context.stroke();
  }
};

const drawRings = (
  context: CanvasRenderingContext2D,
  worm: WormPass,
  head: number,
  time: number,
) => {
  const y = pathY(worm, head);
  Array.from({ length: 4 }).forEach((_, index) => {
    const phase = (((time * 0.9 + index / 4) % 1) + 1) % 1;
    const radius = worm.girth * (1 + phase * 4.5);
    context.strokeStyle = `rgba(232, 200, 150, ${0.32 * (1 - phase)})`;
    context.lineWidth = 1.2;
    context.beginPath();
    context.ellipse(
      head + worm.direction * worm.girth * 0.8,
      y,
      radius,
      radius * 0.32,
      0,
      worm.direction > 0 ? -Math.PI / 2 : Math.PI / 2,
      worm.direction > 0 ? Math.PI / 2 : (Math.PI * 3) / 2,
    );
    context.stroke();
  });
};

const updateSpray = (
  { context, worm, spray, delta }: DrawWormParams,
  head: number,
) => {
  const y = pathY(worm, head);
  if (head > -40 && head < worm.width + 40) {
    Array.from({ length: 7 }).forEach(() =>
      spray.push({
        x: head + (Math.random() - 0.3) * worm.girth * worm.direction,
        y: y - worm.girth * (0.2 + Math.random() * 0.4),
        vx:
          worm.direction *
          (20 + Math.random() * 90) *
          (Math.random() > 0.3 ? 1 : -0.4),
        vy: -(30 + Math.random() * 110),
        life: 1,
      }),
    );
  }

  const settled = spray.filter((grain) => grain.life > 0);
  spray.length = 0;
  settled.forEach((grain) => {
    grain.vy += 170 * delta;
    grain.x += grain.vx * delta;
    grain.y += grain.vy * delta;
    grain.life -= delta * 0.9;
    if (grain.life > 0) spray.push(grain);
  });

  context.fillStyle = 'rgba(236, 206, 158, 0.75)';
  spray.forEach((grain) => {
    context.globalAlpha = Math.max(0, grain.life) * 0.8;
    context.fillRect(grain.x, grain.y, 1.6, 1.6);
  });
  context.globalAlpha = 1;
};

export function drawWorm(params: DrawWormParams) {
  const { context, worm, time } = params;
  const head = headX(worm, time);

  context.save();
  context.lineCap = 'round';
  strokeBody({
    context,
    worm,
    head,
    lift: 0.34,
    scale: 1.7,
    color: (fade) => `rgba(6, 3, 2, ${0.5 * fade})`,
  });
  strokeBody({
    context,
    worm,
    head,
    lift: 0,
    scale: 1,
    color: (fade) => `rgba(120, 74, 38, ${0.92 * fade})`,
  });
  strokeBody({
    context,
    worm,
    head,
    lift: -0.16,
    scale: 0.62,
    color: (fade) => `rgba(186, 132, 76, ${0.85 * fade})`,
  });
  strokeBody({
    context,
    worm,
    head,
    lift: -0.33,
    scale: 0.14,
    color: (fade) => `rgba(246, 218, 170, ${0.85 * fade})`,
  });

  const y = pathY(worm, head);
  const mound = context.createRadialGradient(
    head,
    y - worm.girth * 0.2,
    0,
    head,
    y,
    worm.girth * 1.6,
  );
  mound.addColorStop(0, 'rgba(236, 196, 140, 0.55)');
  mound.addColorStop(1, 'rgba(236, 196, 140, 0)');
  context.fillStyle = mound;
  context.fillRect(
    head - worm.girth * 2,
    y - worm.girth * 2,
    worm.girth * 4,
    worm.girth * 4,
  );

  drawRings(context, worm, head, time);
  updateSpray(params, head);
  context.restore();

  return {
    finished: (time - worm.start) * worm.speed > worm.width + worm.length + 200,
  };
}
