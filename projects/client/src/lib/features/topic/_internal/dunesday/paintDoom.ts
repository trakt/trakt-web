import { seededRandom } from '../shared/seededRandom.ts';
import type { PaintParams } from './PaintParams.ts';

const PLATE_ROW = 132;

function paintBase({ ctx, width, height }: PaintParams) {
  const base = ctx.createLinearGradient(0, 0, 0, height);
  base.addColorStop(0, '#080d10');
  base.addColorStop(0.55, '#0a1413');
  base.addColorStop(1, '#050a0a');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(
    width * 0.84,
    height * 1.05,
    0,
    width * 0.84,
    height * 1.05,
    height * 0.8,
  );
  glow.addColorStop(0, 'rgba(40, 230, 140, 0.26)');
  glow.addColorStop(0.4, 'rgba(20, 160, 100, 0.1)');
  glow.addColorStop(1, 'rgba(10, 80, 60, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
}

function paintPlates({ ctx, width, height }: PaintParams) {
  const random = seededRandom(2026);
  const rows = Math.ceil(height / PLATE_ROW) + 1;

  Array.from({ length: rows }).forEach((_, row) => {
    const y = row * PLATE_ROW - 40;
    const widths = Array.from({ length: 24 }, () => 140 + random() * 220);
    widths.reduce((x, plateWidth) => {
      if (x > width) return x;
      const shade = ctx.createLinearGradient(
        x,
        y,
        x + plateWidth,
        y + PLATE_ROW,
      );
      shade.addColorStop(0, `rgba(170, 195, 205, ${0.035 + random() * 0.03})`);
      shade.addColorStop(1, 'rgba(170, 195, 205, 0)');
      ctx.fillStyle = shade;
      ctx.fillRect(x + 2, y + 2, plateWidth - 4, PLATE_ROW - 4);

      ctx.fillStyle = 'rgba(210, 230, 240, 0.09)';
      ctx.fillRect(x + 2, y + 2, plateWidth - 4, 1);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(x + 2, y + PLATE_ROW - 3, plateWidth - 4, 1);

      const rivets: ReadonlyArray<readonly [number, number]> = [
        [x + 9, y + 9],
        [x + plateWidth - 9, y + 9],
        [x + 9, y + PLATE_ROW - 9],
        [x + plateWidth - 9, y + PLATE_ROW - 9],
      ];
      rivets.forEach(([rx, ry]) => {
        ctx.beginPath();
        ctx.arc(rx, ry, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 235, 240, 0.16)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(rx + 0.5, ry + 0.6, 1.8, 0, Math.PI);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fill();
      });
      return x + plateWidth;
    }, -random() * 200);
  });
}

function paintTraces({ ctx, width, height }: PaintParams) {
  const random = seededRandom(77);
  ctx.lineWidth = 1;
  Array.from({ length: 14 }).forEach(() => {
    const startX = width * (0.35 + random() * 0.65);
    const startY = random() * height;
    const steps = Array.from({ length: 4 }, (_, index) =>
      index % 2 === 0
        ? ([(random() - 0.3) * 260, 0] as const)
        : ([0, (random() - 0.5) * 220] as const),
    );
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    const end = steps.reduce(
      ([x, y], [dx, dy]) => {
        ctx.lineTo(x + dx, y + dy);
        return [x + dx, y + dy] as const;
      },
      [startX, startY] as const,
    );
    ctx.strokeStyle = 'rgba(60, 240, 150, 0.12)';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(end[0], end[1], 2.4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(120, 255, 190, 0.35)';
    ctx.fill();
  });
}

function paintSigil({ ctx, width, height }: PaintParams) {
  const cx = width * 0.86;
  const cy = height * 0.28;
  const radius = Math.min(height * 0.34, 340);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = 'rgba(90, 255, 170, 0.1)';
  [1, 0.86, 0.6, 0.34].forEach((scale) => {
    ctx.lineWidth = scale === 0.86 ? 6 : 1;
    ctx.beginPath();
    ctx.arc(0, 0, radius * scale, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.lineWidth = 1.2;
  Array.from({ length: 72 }).forEach((_, index) => {
    const angle = (index / 72) * Math.PI * 2;
    const inner = radius * (index % 6 === 0 ? 0.88 : 0.93);
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    ctx.stroke();
  });
  Array.from({ length: 6 }).forEach((_, index) => {
    const angle = (index / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(
      Math.cos(angle) * radius * 0.34,
      Math.sin(angle) * radius * 0.34,
    );
    ctx.lineTo(
      Math.cos(angle + 0.9) * radius * 0.6,
      Math.sin(angle + 0.9) * radius * 0.6,
    );
    ctx.stroke();
  });
  ctx.restore();
}

export function paintDoom(params: PaintParams) {
  paintBase(params);
  paintPlates(params);
  paintTraces(params);
  paintSigil(params);
}
