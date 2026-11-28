import { seededRandom } from '../shared/seededRandom.ts';

type PaintDesertSceneParams = {
  width: number;
  height: number;
  dpr: number;
  night: boolean;
};

type Dune = { center: number; height: number; reach: number };

type Ridge = {
  base: number;
  dunes: ReadonlyArray<Dune>;
};

type Monolith = {
  at: number;
  rise: number;
  breadth: number;
};

const MONOLITHS: ReadonlyArray<Monolith> = [
  { at: 0.462, rise: 0.3, breadth: 0.019 },
  { at: 0.492, rise: 0.17, breadth: 0.011 },
  { at: 0.509, rise: 0.095, breadth: 0.011 },
  { at: 0.885, rise: 0.12, breadth: 0.008 },
];

const createRidge = ({
  seed,
  base,
  width,
  height,
  count,
}: {
  seed: number;
  base: number;
  width: number;
  height: number;
  count: number;
}): Ridge => {
  const random = seededRandom(seed);
  const dunes = Array.from({ length: count }, (_, index) => ({
    center:
      ((index + 0.15 + random() * 0.7) / count) * width * 1.15 - width * 0.07,
    height: height * (0.45 + random() * 0.55),
    reach: (width / count) * (0.9 + random() * 0.8),
  }));
  return { base, dunes };
};

const ridgeAt = (ridge: Ridge, x: number) =>
  ridge.base -
  ridge.dunes.reduce((highest, dune) => {
    const offset = (x - dune.center) / dune.reach;
    const falloff = offset < 0 ? offset * offset * 3.2 : offset * offset * 16;
    return Math.max(highest, dune.height * Math.exp(-falloff));
  }, 0);

const traceRidge = (
  context: CanvasRenderingContext2D,
  ridge: Ridge,
  width: number,
) => {
  context.moveTo(0, ridgeAt(ridge, 0));
  for (let x = 2; x <= width + 2; x += 2) context.lineTo(x, ridgeAt(ridge, x));
};

const paintSky = ({
  context,
  width,
  height,
  horizon,
  night,
}: {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  horizon: number;
  night: boolean;
}) => {
  const sky = context.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, night ? 'rgb(9, 9, 13)' : 'rgb(15, 10, 8)');
  sky.addColorStop(0.55, night ? 'rgb(17, 14, 16)' : 'rgb(26, 17, 12)');
  sky.addColorStop(0.86, night ? 'rgb(46, 34, 32)' : 'rgb(68, 41, 23)');
  sky.addColorStop(1, night ? 'rgb(92, 64, 44)' : 'rgb(128, 79, 40)');
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);
};

const paintSun = ({
  context,
  width,
  height,
  horizon,
}: {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  horizon: number;
}) => {
  const x = width * 0.24;
  const y = horizon - height * 0.012;
  const glow = context.createRadialGradient(x, y, 0, x, y, width * 0.42);
  glow.addColorStop(0, 'rgba(255, 214, 150, 0.36)');
  glow.addColorStop(0.25, 'rgba(226, 150, 80, 0.16)');
  glow.addColorStop(1, 'rgba(120, 60, 30, 0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  const radius = Math.max(14, width * 0.016);
  const disc = context.createRadialGradient(x, y, 0, x, y, radius);
  disc.addColorStop(0, 'rgba(255, 246, 222, 0.95)');
  disc.addColorStop(0.8, 'rgba(255, 226, 170, 0.85)');
  disc.addColorStop(1, 'rgba(255, 210, 150, 0)');
  context.fillStyle = disc;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
};

const paintMoon = ({
  context,
  x,
  y,
  radius,
  seed,
}: {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;
  seed: number;
}) => {
  const halo = context.createRadialGradient(
    x,
    y,
    radius * 0.8,
    x,
    y,
    radius * 5,
  );
  halo.addColorStop(0, 'rgba(232, 224, 204, 0.16)');
  halo.addColorStop(1, 'rgba(232, 224, 204, 0)');
  context.fillStyle = halo;
  context.fillRect(x - radius * 5, y - radius * 5, radius * 10, radius * 10);

  const face = context.createRadialGradient(
    x - radius * 0.35,
    y - radius * 0.35,
    radius * 0.1,
    x,
    y,
    radius,
  );
  face.addColorStop(0, 'rgb(242, 234, 216)');
  face.addColorStop(0.75, 'rgb(206, 194, 172)');
  face.addColorStop(1, 'rgb(150, 138, 120)');
  context.fillStyle = face;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();

  const random = seededRandom(seed);
  context.save();
  context.clip();
  Array.from({ length: 7 }).forEach(() => {
    context.fillStyle = `rgba(110, 96, 82, ${0.08 + random() * 0.12})`;
    context.beginPath();
    context.arc(
      x + (random() - 0.5) * radius * 1.4,
      y + (random() - 0.5) * radius * 1.4,
      radius * (0.1 + random() * 0.28),
      0,
      Math.PI * 2,
    );
    context.fill();
  });
  const terminator = context.createLinearGradient(x - radius, y, x + radius, y);
  terminator.addColorStop(0.55, 'rgba(10, 10, 16, 0)');
  terminator.addColorStop(1, 'rgba(10, 10, 16, 0.55)');
  context.fillStyle = terminator;
  context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  context.restore();
};

const paintStars = ({
  context,
  width,
  horizon,
}: {
  context: CanvasRenderingContext2D;
  width: number;
  horizon: number;
}) => {
  const random = seededRandom(77);
  Array.from({ length: Math.round(width / 9) }).forEach(() => {
    const y = random() * horizon * 0.8;
    context.fillStyle = `rgba(236, 228, 214, ${0.08 + random() * 0.4 * (1 - y / horizon)})`;
    context.fillRect(
      random() * width,
      y,
      random() > 0.92 ? 1.6 : 1,
      random() > 0.92 ? 1.6 : 1,
    );
  });
};

const paintRidge = ({
  context,
  ridge,
  width,
  height,
  body,
  crest,
  shade,
}: {
  context: CanvasRenderingContext2D;
  ridge: Ridge;
  width: number;
  height: number;
  body: [string, string];
  crest: string;
  shade: number;
}) => {
  const top = ridge.base - Math.max(...ridge.dunes.map((dune) => dune.height));
  const fill = context.createLinearGradient(0, top, 0, height);
  fill.addColorStop(0, body[0]);
  fill.addColorStop(
    Math.min(1, (ridge.base - top) / (height - top) + 0.1),
    body[1],
  );
  fill.addColorStop(1, body[1]);

  context.beginPath();
  traceRidge(context, ridge, width);
  context.lineTo(width, height);
  context.lineTo(0, height);
  context.closePath();
  context.fillStyle = fill;
  context.fill();

  for (let x = 0; x < width; x += 2) {
    const y = ridgeAt(ridge, x);
    const fall = ridgeAt(ridge, x + 2) - y;
    if (fall <= 0.05) continue;
    context.fillStyle = `rgba(4, 2, 1, ${Math.min(shade, fall * 0.22)})`;
    context.fillRect(x, y, 2, (height - y) * 0.55);
  }

  context.beginPath();
  traceRidge(context, ridge, width);
  context.strokeStyle = crest;
  context.lineWidth = 1.1;
  context.stroke();
};

const paintMonoliths = ({
  context,
  ridge,
  width,
  height,
  night,
}: {
  context: CanvasRenderingContext2D;
  ridge: Ridge;
  width: number;
  height: number;
  night: boolean;
}) => {
  MONOLITHS.forEach(({ at, rise, breadth }) => {
    const x = width * at;
    const span = Math.max(4, width * breadth);
    const foot = Math.max(ridgeAt(ridge, x), ridgeAt(ridge, x + span)) + 3;
    const top = foot - height * rise;

    const cast = context.createLinearGradient(x, foot, x + width * 0.16, foot);
    cast.addColorStop(0, 'rgba(3, 2, 2, 0.55)');
    cast.addColorStop(1, 'rgba(3, 2, 2, 0)');
    context.fillStyle = cast;
    context.beginPath();
    context.moveTo(x + span * 0.2, foot);
    context.lineTo(x + span, foot - 2);
    context.lineTo(x + span + width * 0.16, foot + height * 0.012);
    context.lineTo(x + width * 0.14, foot + height * 0.02);
    context.closePath();
    context.fill();

    context.fillStyle = 'rgb(7, 6, 6)';
    context.fillRect(x, top, span, foot - top);
    context.fillStyle = night
      ? 'rgba(150, 180, 230, 0.32)'
      : 'rgba(236, 176, 104, 0.42)';
    context.fillRect(x, top, 1, foot - top);
    context.fillStyle = 'rgba(255, 255, 255, 0.04)';
    context.fillRect(x + 1, top, span * 0.35, foot - top);
  });
};

const createLayer = (width: number, height: number, dpr: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const context = canvas.getContext('2d');
  context?.scale(dpr, dpr);
  return { canvas, context };
};

export function paintDesertScene({
  width,
  height,
  dpr,
  night,
}: PaintDesertSceneParams) {
  const back = createLayer(width, height, dpr);
  const front = createLayer(width, height, dpr);
  const horizon = height * 0.72;
  const scene = { back: back.canvas, front: front.canvas, horizon };
  if (!back.context || !front.context) return scene;

  paintSky({ context: back.context, width, height, horizon, night });
  if (night) {
    paintStars({ context: back.context, width, horizon });
    const radius = Math.max(22, width * 0.024);
    paintMoon({
      context: back.context,
      x: width * 0.83,
      y: height * 0.2,
      radius,
      seed: 3,
    });
    paintMoon({
      context: back.context,
      x: width * 0.885,
      y: height * 0.12,
      radius: radius * 0.42,
      seed: 9,
    });
  } else {
    paintSun({ context: back.context, width, height, horizon });
  }

  const far = createRidge({
    seed: 11,
    base: horizon,
    width,
    height: height * 0.035,
    count: 9,
  });
  const middle = createRidge({
    seed: 23,
    base: horizon + height * 0.085,
    width,
    height: height * 0.07,
    count: 6,
  });
  const near = createRidge({
    seed: 41,
    base: height * 1.01,
    width,
    height: height * 0.1,
    count: 4,
  });

  paintRidge({
    context: back.context,
    ridge: far,
    width,
    height,
    body: night
      ? ['rgb(72, 50, 36)', 'rgb(34, 24, 19)']
      : ['rgb(96, 58, 31)', 'rgb(46, 28, 17)'],
    crest: night ? 'rgba(232, 208, 172, 0.36)' : 'rgba(240, 180, 110, 0.4)',
    shade: 0.25,
  });
  paintRidge({
    context: front.context,
    ridge: middle,
    width,
    height,
    body: night
      ? ['rgb(46, 32, 24)', 'rgb(20, 14, 11)']
      : ['rgb(58, 35, 20)', 'rgb(26, 16, 11)'],
    crest: night ? 'rgba(226, 200, 164, 0.3)' : 'rgba(226, 160, 92, 0.32)',
    shade: 0.3,
  });
  paintMonoliths({
    context: front.context,
    ridge: middle,
    width,
    height,
    night,
  });
  paintRidge({
    context: front.context,
    ridge: near,
    width,
    height,
    body: night
      ? ['rgb(30, 21, 16)', 'rgb(11, 8, 7)']
      : ['rgb(34, 21, 14)', 'rgb(13, 9, 7)'],
    crest: night ? 'rgba(220, 192, 156, 0.24)' : 'rgba(210, 146, 84, 0.26)',
    shade: 0.35,
  });

  return scene;
}
