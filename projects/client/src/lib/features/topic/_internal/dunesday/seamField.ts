import type { PaintParams } from './PaintParams.ts';
import { paintDesert } from './paintDesert.ts';
import { paintDoom } from './paintDoom.ts';
import { runFrameLoop } from '../shared/runFrameLoop.ts';
import { SEAM_LEAN } from './SEAM_LEAN.ts';
import { seamGeometry } from './seamGeometry.ts';
import { seededRandom } from '../shared/seededRandom.ts';

type SeamFieldParams = {
  art: HTMLCanvasElement;
  fx: HTMLCanvasElement;
  target: () => number;
  animate: boolean;
};

type Grain = {
  x: number;
  y: number;
  vx: number;
  phase: number;
  size: number;
  tone: number;
};
type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  age: number;
  hot: boolean;
};
type Mote = { x: number; y: number; vy: number; size: number; phase: number };
type SparkBurst = { x: number; y: number; count: number };
type Band = {
  from: number;
  to: number;
  stops: ReadonlyArray<readonly [number, string]>;
};
type Shard = {
  s: number;
  offset: number;
  points: ReadonlyArray<readonly [number, number]>;
};

const NORMAL_LENGTH = Math.hypot(1, SEAM_LEAN);
const NORMAL = { x: 1 / NORMAL_LENGTH, y: SEAM_LEAN / NORMAL_LENGTH };
const SAND_TONES = ['255, 214, 150', '240, 190, 120', '255, 232, 190'];

type CreateLayerParams = {
  width: number;
  height: number;
  paint: (params: PaintParams) => void;
};

const createLayer = ({ width, height, paint }: CreateLayerParams) => {
  const layer = document.createElement('canvas');
  layer.width = width;
  layer.height = height;
  const ctx = layer.getContext('2d');
  if (ctx) paint({ ctx, width, height });
  return layer;
};

const createShards = (count: number): ReadonlyArray<Shard> => {
  const random = seededRandom(1218);
  return Array.from({ length: count }, () => {
    const size = 1.6 + random() * 4.2;
    return {
      s: random(),
      offset: -random() * 10 + 1.5,
      points: Array.from({ length: 3 }, (_, index) => {
        const angle = (index / 3) * Math.PI * 2 + random() * 1.2;
        return [
          Math.cos(angle) * size * 0.7,
          Math.sin(angle) * size * 1.6,
        ] as const;
      }),
    };
  });
};

export function seamField({ art, fx, target, animate }: SeamFieldParams) {
  const artCtx = art.getContext('2d');
  const fxCtx = fx.getContext('2d');
  if (!artCtx || !fxCtx) return { stop: () => {}, redraw: () => {} };

  const random = Math.random;
  const view = {
    width: 0,
    height: 0,
    dpr: 1,
    desert: document.createElement('canvas'),
    doom: document.createElement('canvas'),
    fraction: target(),
  };
  const grains: Array<Grain> = [];
  const sparks: Array<Spark> = [];
  const motes: Array<Mote> = [];
  const shards = createShards(60);

  const seam = () => seamGeometry(view.width, view.height, view.fraction);

  const spawnGrain = (anywhere: boolean): Grain => {
    const { xAt } = seam();
    const y = random() * view.height;
    return {
      x: anywhere ? random() * Math.max(0, xAt(y)) : -10,
      y,
      vx: 26 + random() * 60,
      phase: random() * Math.PI * 2,
      size: 0.6 + random() * 1.3,
      tone: Math.floor(random() * SAND_TONES.length),
    };
  };

  const spawnMote = (anywhere: boolean): Mote => ({
    x: view.width * (0.3 + random() * 0.7),
    y: anywhere ? random() * view.height : view.height + 10,
    vy: 8 + random() * 22,
    size: 0.8 + random() * 1.6,
    phase: random() * Math.PI * 2,
  });

  const spawnSparks = ({ x, y, count }: SparkBurst) => {
    if (sparks.length > 120) return;
    Array.from({ length: count }).forEach(() => {
      const speed = 60 + random() * 170;
      const spread = (random() - 0.5) * 1.6;
      sparks.push({
        x,
        y,
        vx: (NORMAL.x * Math.cos(spread) - NORMAL.y * Math.sin(spread)) * speed,
        vy:
          (NORMAL.y * Math.cos(spread) + NORMAL.x * Math.sin(spread)) * speed -
          40,
        life: 0.35 + random() * 0.6,
        age: 0,
        hot: random() > 0.6,
      });
    });
  };

  const resize = () => {
    view.width = window.innerWidth;
    view.height = window.innerHeight;
    view.dpr = Math.min(window.devicePixelRatio || 1, 2);
    art.width = view.width;
    art.height = view.height;
    fx.width = Math.round(view.width * view.dpr);
    fx.height = Math.round(view.height * view.dpr);
    view.desert = createLayer({
      width: view.width,
      height: view.height,
      paint: paintDesert,
    });
    view.doom = createLayer({
      width: view.width,
      height: view.height,
      paint: paintDoom,
    });
    const area = (view.width * view.height) / (1440 * 900);
    grains.length = 0;
    motes.length = 0;
    Array.from({ length: Math.round(150 * Math.max(0.4, area)) }).forEach(() =>
      grains.push(spawnGrain(true)),
    );
    Array.from({ length: Math.round(46 * Math.max(0.4, area)) }).forEach(() =>
      motes.push(spawnMote(true)),
    );
  };

  const drawArt = (time: number) => {
    const { width, height } = view;
    const { xAt, top, bottom } = seam();
    artCtx.drawImage(view.desert, 0, 0);

    if (animate) {
      const bandTop = Math.round(height * 0.5);
      const bandBottom = Math.round(height * 0.82);
      Array.from({ length: Math.ceil((bandBottom - bandTop) / 3) }).forEach(
        (_, index) => {
          const y = bandTop + index * 3;
          const falloff = Math.sin(
            ((y - bandTop) / (bandBottom - bandTop)) * Math.PI,
          );
          const shift = Math.sin(y * 0.11 + time * 3.4) * 1.6 * falloff;
          artCtx.drawImage(view.desert, 0, y, width, 3, shift, y, width, 3);
        },
      );
    }

    artCtx.save();
    artCtx.beginPath();
    artCtx.moveTo(top, 0);
    artCtx.lineTo(width + 1, 0);
    artCtx.lineTo(width + 1, height);
    artCtx.lineTo(bottom, height);
    artCtx.closePath();
    artCtx.clip();
    artCtx.drawImage(view.doom, 0, 0);
    artCtx.restore();

    const middleX = xAt(height / 2);
    const middleY = height / 2;
    const band = ({ from, to, stops }: Band) => {
      const gradient = artCtx.createLinearGradient(
        middleX + NORMAL.x * from,
        middleY + NORMAL.y * from,
        middleX + NORMAL.x * to,
        middleY + NORMAL.y * to,
      );
      stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
      artCtx.fillStyle = gradient;
      artCtx.beginPath();
      artCtx.moveTo(top + from / NORMAL.x, 0);
      artCtx.lineTo(top + to / NORMAL.x, 0);
      artCtx.lineTo(bottom + to / NORMAL.x, height);
      artCtx.lineTo(bottom + from / NORMAL.x, height);
      artCtx.closePath();
      artCtx.fill();
    };

    band({
      from: -90,
      to: 0,
      stops: [
        [0, 'rgba(255, 190, 110, 0)'],
        [0.55, 'rgba(255, 196, 120, 0.06)'],
        [0.82, 'rgba(120, 230, 170, 0.12)'],
        [1, 'rgba(70, 255, 170, 0.26)'],
      ],
    });
    band({
      from: 0,
      to: 140,
      stops: [
        [0, 'rgba(60, 255, 160, 0.22)'],
        [0.3, 'rgba(40, 200, 130, 0.08)'],
        [1, 'rgba(20, 120, 80, 0)'],
      ],
    });
  };

  const drawSeam = (time: number) => {
    const { height } = view;
    const { top, bottom, xAt } = seam();
    const line = fxCtx.createLinearGradient(top, 0, bottom, height);
    line.addColorStop(0, 'rgba(255, 214, 150, 0.9)');
    line.addColorStop(0.5, 'rgba(210, 255, 225, 0.95)');
    line.addColorStop(1, 'rgba(80, 255, 170, 0.9)');

    [
      [18, 'rgba(70, 255, 170, 0.05)'],
      [7, 'rgba(160, 255, 210, 0.12)'],
    ].forEach(([width, color]) => {
      fxCtx.strokeStyle = String(color);
      fxCtx.lineWidth = Number(width);
      fxCtx.beginPath();
      fxCtx.moveTo(top, 0);
      fxCtx.lineTo(bottom, height);
      fxCtx.stroke();
    });
    fxCtx.strokeStyle = line;
    fxCtx.lineWidth = 1.3;
    fxCtx.beginPath();
    fxCtx.moveTo(top, 0);
    fxCtx.lineTo(bottom, height);
    fxCtx.stroke();

    const pulse = ((time * 0.18) % 1.5) * height;
    const pulseX = xAt(pulse);
    const glow = fxCtx.createRadialGradient(
      pulseX,
      pulse,
      0,
      pulseX,
      pulse,
      60,
    );
    glow.addColorStop(0, 'rgba(230, 255, 240, 0.55)');
    glow.addColorStop(0.25, 'rgba(90, 255, 170, 0.22)');
    glow.addColorStop(1, 'rgba(90, 255, 170, 0)');
    fxCtx.fillStyle = glow;
    fxCtx.fillRect(pulseX - 60, pulse - 60, 120, 120);

    const sweep = (time * 0.12) % 1.4;
    shards.forEach((shard) => {
      const y = shard.s * height;
      const x = xAt(y) + shard.offset;
      const glint = Math.max(0, 1 - Math.abs(shard.s - sweep) * 7);
      fxCtx.beginPath();
      shard.points.forEach(([px, py], index) =>
        index === 0
          ? fxCtx.moveTo(x + px, y + py)
          : fxCtx.lineTo(x + px, y + py),
      );
      fxCtx.closePath();
      fxCtx.fillStyle = `rgba(150, 255, 210, ${0.06 + glint * 0.3})`;
      fxCtx.fill();
      fxCtx.strokeStyle = `rgba(220, 255, 236, ${0.22 + glint * 0.7})`;
      fxCtx.lineWidth = 0.6;
      fxCtx.stroke();
    });
  };

  const stepGrains = (time: number, delta: number) => {
    const { xAt } = seam();
    grains.forEach((grain, index) => {
      grain.x += grain.vx * delta;
      grain.y += Math.sin(time * 1.3 + grain.phase) * 9 * delta;
      const edge = xAt(grain.y);
      if (grain.x >= edge) {
        if (random() > 0.55)
          spawnSparks({
            x: edge,
            y: grain.y,
            count: 1 + Math.floor(random() * 3),
          });
        fxCtx.fillStyle = 'rgba(160, 255, 210, 0.9)';
        fxCtx.fillRect(edge - 1.5, grain.y - 1.5, 3, 3);
        grains[index] = spawnGrain(false);
        return;
      }
      const near = Math.max(0, 1 - (edge - grain.x) / 70);
      fxCtx.fillStyle =
        near > 0
          ? `rgba(${Math.round(255 - near * 160)}, ${Math.round(214 + near * 41)}, ${Math.round(150 + near * 30)}, ${0.55 + near * 0.4})`
          : `rgba(${SAND_TONES[grain.tone]}, 0.5)`;
      fxCtx.fillRect(grain.x, grain.y, grain.size, grain.size);
    });
  };

  const stepSparks = (delta: number) => {
    const alive = sparks.filter((spark) => {
      spark.age += delta;
      return spark.age < spark.life;
    });
    sparks.length = 0;
    alive.forEach((spark) => {
      spark.vy += 220 * delta;
      spark.x += spark.vx * delta;
      spark.y += spark.vy * delta;
      const fade = 1 - spark.age / spark.life;
      fxCtx.strokeStyle = spark.hot
        ? `rgba(255, 236, 190, ${fade})`
        : `rgba(110, 255, 180, ${fade})`;
      fxCtx.lineWidth = 1.2;
      fxCtx.beginPath();
      fxCtx.moveTo(spark.x, spark.y);
      fxCtx.lineTo(spark.x - spark.vx * 0.025, spark.y - spark.vy * 0.025);
      fxCtx.stroke();
      sparks.push(spark);
    });
  };

  const stepMotes = (time: number, delta: number) => {
    const { xAt } = seam();
    motes.forEach((mote, index) => {
      mote.y -= mote.vy * delta;
      mote.x += Math.sin(time * 0.8 + mote.phase) * 6 * delta;
      const edge = xAt(mote.y);
      if (mote.y < -10 || mote.x < edge) {
        motes[index] = spawnMote(false);
        return;
      }
      const flicker = 0.35 + Math.sin(time * 3 + mote.phase) * 0.25;
      fxCtx.fillStyle = `rgba(110, 255, 180, ${flicker})`;
      fxCtx.fillRect(mote.x, mote.y, mote.size, mote.size);
    });
  };

  const frame = (time: number, delta: number) => {
    const wobble = animate
      ? Math.sin(time * 0.11) * 0.018 + Math.sin(time * 0.047 + 1) * 0.012
      : 0;
    const goal = target() + wobble;
    view.fraction += animate
      ? (goal - view.fraction) * Math.min(1, delta * 2.4)
      : goal - view.fraction;

    drawArt(time);
    fxCtx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    fxCtx.clearRect(0, 0, view.width, view.height);
    drawSeam(time);
    stepGrains(time, delta);
    stepMotes(time, delta);
    stepSparks(delta);
  };

  resize();

  const redraw = () => frame(4, 0);
  const pendingResize = { handle: 0 };
  const onResize = () => {
    if (pendingResize.handle !== 0) return;
    pendingResize.handle = requestAnimationFrame(() => {
      pendingResize.handle = 0;
      if (
        window.innerWidth === view.width &&
        window.innerHeight === view.height
      )
        return;
      resize();
      if (!animate) redraw();
    });
  };
  const stopListening = () => {
    cancelAnimationFrame(pendingResize.handle);
    window.removeEventListener('resize', onResize);
  };

  if (!animate) {
    redraw();
    window.addEventListener('resize', onResize);
    return { stop: stopListening, redraw };
  }

  window.addEventListener('resize', onResize);
  const stopLoop = runFrameLoop({ fps: 50, frame });

  return {
    stop: () => {
      stopLoop();
      stopListening();
    },
    redraw: () => {},
  };
}
