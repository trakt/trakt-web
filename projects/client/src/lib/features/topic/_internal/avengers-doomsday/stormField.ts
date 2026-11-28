import { runFrameLoop } from '../shared/runFrameLoop.ts';

type Point = { x: number; y: number };

type MutableMote = {
  x: number;
  y: number;
  speed: number;
  size: number;
  phase: number;
};

type MutableBolt = {
  born: number;
  from: Point;
  to: Point;
  paths: ReadonlyArray<ReadonlyArray<Point>>;
};

type StormFieldParams = {
  canvas: HTMLCanvasElement;
  onStrike: () => void;
  animate: boolean;
};

const MOTE_COUNT = 46;
const BOLT_LIFE = 520;
const FLICKER = [1, 0.25, 0.95, 0.15, 0.7, 0.35, 0.5, 0.1];

const between = (min: number, max: number) => min + Math.random() * (max - min);

const displace = (
  from: Point,
  to: Point,
  roughness: number,
  depth: number,
): ReadonlyArray<Point> => {
  if (depth === 0) return [from, to];
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const normalX = -(to.y - from.y) / (length || 1);
  const normalY = (to.x - from.x) / (length || 1);
  const offset = between(-1, 1) * length * roughness;
  const middle = {
    x: (from.x + to.x) / 2 + normalX * offset,
    y: (from.y + to.y) / 2 + normalY * offset,
  };
  return [
    ...displace(from, middle, roughness, depth - 1),
    ...displace(middle, to, roughness, depth - 1).slice(1),
  ];
};

const branch = (trunk: ReadonlyArray<Point>): ReadonlyArray<Point> => {
  const start =
    trunk.at(Math.floor(between(0.25, 0.7) * trunk.length)) ?? trunk.at(0);
  if (!start) return [];
  const angle = between(0, Math.PI * 2);
  const reach = between(60, 160);
  return displace(
    start,
    {
      x: start.x + Math.cos(angle) * reach,
      y: start.y + Math.sin(angle) * reach,
    },
    0.28,
    4,
  );
};

const boltPaths = (from: Point, to: Point) => {
  const trunk = displace(from, to, 0.22, 6);
  return [trunk, branch(trunk), branch(trunk)];
};

const edgePoint = (width: number, height: number): Point => {
  const side = Math.floor(between(0, 3));
  if (side === 0) return { x: between(0.1, 0.9) * width, y: -10 };
  if (side === 1) return { x: -10, y: between(0.1, 0.7) * height };
  return { x: width + 10, y: between(0.1, 0.7) * height };
};

const aimFrom = (from: Point, width: number, height: number): Point => {
  const angle =
    Math.atan2(height * 0.5 - from.y, width * 0.5 - from.x) +
    between(-0.7, 0.7);
  const reach = between(180, 420);
  return {
    x: from.x + Math.cos(angle) * reach,
    y: from.y + Math.sin(angle) * reach,
  };
};

const tracePath = (
  context: CanvasRenderingContext2D,
  path: ReadonlyArray<Point>,
) => {
  context.beginPath();
  path.forEach((point, index) =>
    index === 0
      ? context.moveTo(point.x, point.y)
      : context.lineTo(point.x, point.y),
  );
  context.stroke();
};

export function stormField({ canvas, onStrike, animate }: StormFieldParams) {
  const context = canvas.getContext('2d');
  if (!context) return () => {};

  const size = { width: 0, height: 0 };
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    canvas.width = Math.round(size.width * ratio);
    canvas.height = Math.round(size.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };
  resize();

  const motes: Array<MutableMote> = Array.from({ length: MOTE_COUNT }, () => ({
    x: between(0, size.width),
    y: between(0, size.height),
    speed: between(6, 22),
    size: between(0.5, 1.7),
    phase: between(0, Math.PI * 2),
  }));

  const state: { bolt: MutableBolt | null; nextStrike: number } = {
    bolt: null,
    nextStrike: between(2500, 5000),
  };

  const drawMotes = (time: number, delta: number) => {
    context.globalCompositeOperation = 'lighter';
    motes.forEach((mote) => {
      mote.y -= mote.speed * delta;
      mote.x += Math.sin(time / 2400 + mote.phase) * 0.12;
      if (mote.y < -8) {
        mote.y = size.height + 8;
        mote.x = between(0, size.width);
      }
      const glow = 0.35 + 0.35 * Math.sin(time / 700 + mote.phase);
      context.fillStyle = `rgba(110, 255, 170, ${glow.toFixed(3)})`;
      context.beginPath();
      context.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
      context.fill();
    });
  };

  const drawBolt = (time: number) => {
    const bolt = state.bolt;
    if (!bolt) return;
    const age = time - bolt.born;
    if (age > BOLT_LIFE) {
      state.bolt = null;
      return;
    }
    const step = Math.floor((age / BOLT_LIFE) * FLICKER.length);
    const strength = FLICKER.at(step) ?? 0;
    if (step % 2 === 0 && Math.random() > 0.6)
      bolt.paths = boltPaths(bolt.from, bolt.to);

    context.globalCompositeOperation = 'lighter';
    context.lineCap = 'round';
    context.lineJoin = 'round';
    bolt.paths.forEach((path, index) => {
      const weight = index === 0 ? 1 : 0.55;
      context.strokeStyle = `rgba(40, 255, 140, ${(0.1 * strength * weight).toFixed(3)})`;
      context.lineWidth = 9 * weight;
      tracePath(context, path);
      context.strokeStyle = `rgba(80, 255, 160, ${(0.32 * strength * weight).toFixed(3)})`;
      context.lineWidth = 3 * weight;
      tracePath(context, path);
      context.strokeStyle = `rgba(225, 255, 235, ${(0.9 * strength * weight).toFixed(3)})`;
      context.lineWidth = 1.1 * weight;
      tracePath(context, path);
    });
  };

  const strike = (time: number) => {
    const from = edgePoint(size.width, size.height);
    const to = aimFrom(from, size.width, size.height);
    state.bolt = { born: time, from, to, paths: boltPaths(from, to) };
    state.nextStrike = time + between(7000, 15000);
    onStrike();
  };

  const pending = { frame: 0 };
  const onResize = () => {
    if (pending.frame !== 0) return;
    pending.frame = requestAnimationFrame(() => {
      pending.frame = 0;
      resize();
      if (!animate) drawMotes(0, 0);
    });
  };

  window.addEventListener('resize', onResize);
  const stopResize = () => {
    cancelAnimationFrame(pending.frame);
    window.removeEventListener('resize', onResize);
  };

  if (!animate) {
    drawMotes(0, 0);
    return stopResize;
  }

  const stopLoop = runFrameLoop({
    fps: 60,
    frame: (seconds, delta) => {
      const time = seconds * 1000;
      context.clearRect(0, 0, size.width, size.height);
      drawMotes(time, delta);
      if (time > state.nextStrike) strike(time);
      drawBolt(time);
    },
  });

  return () => {
    stopLoop();
    stopResize();
  };
}
