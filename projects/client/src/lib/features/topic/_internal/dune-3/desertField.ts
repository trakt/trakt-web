import { runFrameLoop } from '../shared/runFrameLoop.ts';
import { drawWorm } from './drawWorm.ts';
import { isNight } from './isNight.ts';
import { paintDesertScene } from './paintDesertScene.ts';
import type { WormPass } from './WormPass.ts';
import type { WormSign } from './WormSign.ts';

type DesertFieldParams = {
  canvas: HTMLCanvasElement;
  animate: boolean;
  wormSign: WormSign;
};

type Grains = {
  x: Float32Array;
  y: Float32Array;
  depth: Float32Array;
  phase: Float32Array;
};

type Scene = ReturnType<typeof paintDesertScene>;

const LAYERS = [
  { from: 0, to: 0.45, width: 0.7, alpha: 0.14 },
  { from: 0.45, to: 0.8, width: 1, alpha: 0.24 },
  { from: 0.8, to: 1.01, width: 1.5, alpha: 0.38 },
] as const;

const smooth = (value: number) => {
  const clamped = Math.min(1, Math.max(0, value));
  return clamped * clamped * (3 - 2 * clamped);
};

const gustAt = (time: number) =>
  smooth(
    (Math.sin(time * 0.23) * 0.65 + Math.sin(time * 0.083 + 2.1) * 0.7 - 0.3) *
      1.6,
  );

const spawnY = (height: number) => height * (1 - Math.random() ** 1.7 * 0.92);

const createGrains = (width: number, height: number): Grains => {
  const count = Math.round(
    Math.min(460, Math.max(140, (width * height) / 3600)),
  );
  const grains = {
    x: new Float32Array(count),
    y: new Float32Array(count),
    depth: new Float32Array(count),
    phase: new Float32Array(count),
  };
  for (let index = 0; index < count; index++) {
    grains.x[index] = Math.random() * width;
    grains.y[index] = spawnY(height);
    grains.depth[index] = Math.random();
    grains.phase[index] = Math.random() * Math.PI * 2;
  }
  return grains;
};

const createWorm = (width: number, height: number, time: number): WormPass => ({
  start: time,
  direction: Math.random() > 0.5 ? 1 : -1,
  baseline: height * (0.5 + Math.random() * 0.3),
  sway: height * (0.04 + Math.random() * 0.04),
  wavelength: width * (0.07 + Math.random() * 0.05),
  speed: Math.max(260, width / 4.6),
  length: Math.min(900, width * 0.62),
  girth: Math.min(62, Math.max(28, width * 0.038)),
  width,
});

export function desertField({ canvas, animate, wormSign }: DesertFieldParams) {
  const context = canvas.getContext('2d');
  if (!context) return () => {};

  const view = { width: 0, height: 0, dpr: 1 };
  const motion = {
    wind: 0,
    wormAt: -Infinity,
    rippleSource: 0.5,
    resizeFrame: 0,
    scene: null as Scene | null,
    grains: createGrains(1, 1),
    worm: null as WormPass | null,
  };
  const spray: Parameters<typeof drawWorm>[0]['spray'] = [];

  const resize = () => {
    view.dpr = Math.min(2, window.devicePixelRatio || 1);
    view.width = window.innerWidth;
    view.height = window.innerHeight;
    canvas.width = Math.round(view.width * view.dpr);
    canvas.height = Math.round(view.height * view.dpr);
    motion.scene = paintDesertScene({ ...view, night: isNight(new Date()) });
    motion.grains = createGrains(view.width, view.height);
  };

  const drawScene = (time: number, tremor: number) => {
    const { scene } = motion;
    if (!scene) return;
    const shakeX = tremor ? (Math.random() - 0.5) * tremor : 0;
    const shakeY = tremor ? (Math.random() - 0.5) * tremor * 0.6 : 0;
    context.drawImage(scene.back, shakeX, shakeY, view.width, view.height);

    if (animate) drawHaze(time, shakeX, shakeY);
    context.drawImage(scene.front, shakeX, shakeY, view.width, view.height);
  };

  const drawHaze = (time: number, shakeX: number, shakeY: number) => {
    const { scene } = motion;
    if (!scene) return;
    const { dpr } = view;
    const top = Math.max(0, scene.horizon - view.height * 0.09);
    const bottom = Math.min(view.height, scene.horizon + view.height * 0.035);
    for (let y = top; y < bottom; y += 2) {
      const closeness = 1 - Math.abs(y - scene.horizon) / (scene.horizon - top);
      const amplitude = 2.4 * Math.max(0, closeness) ** 1.5;
      const offset =
        Math.sin(time * 2.4 + y * 0.22) * amplitude +
        Math.sin(time * 1.1 + y * 0.05) * amplitude * 0.6;
      context.drawImage(
        scene.back,
        0,
        y * dpr,
        view.width * dpr,
        2 * dpr,
        offset + shakeX,
        y + shakeY,
        view.width,
        2,
      );
    }
  };

  const drawGrains = (
    time: number,
    delta: number,
    gust: number,
    level: number,
  ) => {
    const { x, y, depth, phase } = motion.grains;
    const target = 34 + gust * 230 + level * 70;
    motion.wind += (target - motion.wind) * Math.min(1, delta * 1.6);

    LAYERS.forEach((layer) => {
      context.beginPath();
      for (let index = 0; index < x.length; index++) {
        const z = depth[index];
        if (z < layer.from || z >= layer.to) continue;
        const speed = motion.wind * (0.35 + z * 0.95);
        x[index] += speed * delta;
        y[index] += (Math.sin(time * 0.9 + phase[index]) * 9 * z + 2.5) * delta;
        if (x[index] > view.width + 24 || y[index] > view.height + 6) {
          x[index] = -24 - Math.random() * 40;
          y[index] = spawnY(view.height);
        }
        const streak = 0.8 + speed * 0.035;
        context.moveTo(x[index], y[index]);
        context.lineTo(x[index] - streak, y[index] - streak * 0.08);
      }
      context.lineWidth = layer.width;
      context.strokeStyle = `rgba(228, 196, 146, ${layer.alpha * (0.7 + gust * 0.6)})`;
      context.stroke();
    });

    if (gust < 0.05) return;
    Array.from({ length: 3 }).forEach((_, index) => {
      const drift =
        ((time * (60 + index * 25) * (0.4 + gust)) % (view.width * 1.6)) -
        view.width * 0.3;
      const centerY = view.height * (0.72 + index * 0.09);
      const radius = view.width * (0.22 + index * 0.06);
      const veil = context.createRadialGradient(
        drift,
        centerY,
        0,
        drift,
        centerY,
        radius,
      );
      veil.addColorStop(0, `rgba(214, 170, 112, ${0.07 * gust})`);
      veil.addColorStop(1, 'rgba(214, 170, 112, 0)');
      context.fillStyle = veil;
      context.save();
      context.translate(drift, centerY);
      context.scale(1, 0.22);
      context.translate(-drift, -centerY);
      context.fillRect(
        drift - radius,
        centerY - radius,
        radius * 2,
        radius * 2,
      );
      context.restore();
    });
  };

  const drawRipples = (time: number, level: number) => {
    if (level < 0.3) return;
    const strength = (level - 0.3) / 0.7;
    const originX = view.width * motion.rippleSource;
    const originY = view.height * 1.02;
    const count = 3 + Math.round(strength * 4);
    for (let index = 0; index < count; index++) {
      const phase = (time * (0.32 + strength * 0.4) + index / count) % 1;
      const radius = view.width * (0.08 + phase * 0.85);
      context.strokeStyle = `rgba(232, 200, 150, ${(1 - phase) * 0.16 * (0.4 + strength)})`;
      context.lineWidth = 1 + strength;
      context.beginPath();
      context.ellipse(
        originX,
        originY,
        radius,
        radius * 0.34,
        0,
        Math.PI,
        Math.PI * 2,
      );
      context.stroke();
    }
  };

  const render = (time: number, delta: number) => {
    const reading = wormSign.read(performance.now());
    if (reading.wormAt !== motion.wormAt) {
      motion.wormAt = reading.wormAt;
      motion.worm = createWorm(view.width, view.height, time);
      motion.rippleSource = 0.2 + Math.random() * 0.6;
    }

    const { worm } = motion;
    const gust = gustAt(time);
    const tremor =
      (reading.level > 0.45 ? (reading.level - 0.45) * 3.2 : 0) +
      (worm ? 2.2 : 0);

    context.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    context.clearRect(0, 0, view.width, view.height);
    drawScene(time, tremor);
    drawRipples(time, worm ? 1 : reading.level);
    if (worm) {
      const pass = drawWorm({ context, worm, time, spray, delta });
      if (pass.finished) motion.worm = null;
    }
    drawGrains(time, delta, worm ? Math.max(gust, 0.6) : gust, reading.level);
  };

  const renderStill = () =>
    render(animate ? 0 : performance.now() / 1000, 0.016);

  const onResize = () => {
    cancelAnimationFrame(motion.resizeFrame);
    motion.resizeFrame = requestAnimationFrame(() => {
      resize();
      if (!animate) renderStill();
    });
  };

  resize();
  renderStill();
  const stopLoop = animate
    ? runFrameLoop({ fps: 60, frame: render })
    : () => {};
  window.addEventListener('resize', onResize);

  return () => {
    stopLoop();
    cancelAnimationFrame(motion.resizeFrame);
    window.removeEventListener('resize', onResize);
  };
}
