import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';

const FLAKE_COUNT = 200;

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  step: number;
  stepSize: number;
  opacity: number;
  type: 'slow' | 'fast';
};

function createFlakes(): Particle[] {
  const width = globalThis.window.innerWidth;
  const height = globalThis.window.innerHeight;

  return Array.from({ length: FLAKE_COUNT }).map(() => {
    const isFast = Math.random() > 0.6;
    const commonProps = {
      x: Math.random() * width,
      y: Math.random() * height,
      step: Math.random() * Math.PI * 2,
      stepSize: Math.random() / 30,
      opacity: Math.random() * 0.5 + 0.3,
    };

    if (isFast) {
      return {
        ...commonProps,
        size: 1,
        speed: Math.random() + 1.5,
        type: 'fast' as const,
      };
    }

    return {
      ...commonProps,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() + 0.5,
      type: 'slow' as const,
    };
  });
}

function renderFlake(ctx: CanvasRenderingContext2D, flake: Particle) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  flake.y += flake.speed;
  flake.step += flake.stepSize;

  const swayIntensity = flake.type === 'fast' ? 2 : 1.2;
  flake.x += Math.cos(flake.step) * swayIntensity;

  // Reset logic: ensure they reappear at the top within the current width
  if (flake.y > height) {
    flake.y = -10;
    flake.x = Math.random() * width;
  }

  // Wrap-around logic for horizontal sway
  if (flake.x > width + 20) flake.x = -10;
  if (flake.x < -20) flake.x = width + 10;

  ctx.globalAlpha = flake.opacity;
  ctx.beginPath();

  if (flake.type === 'fast') {
    ctx.rect(flake.x, flake.y, 1, 1);
    ctx.fill();
    return;
  }

  ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
  ctx.fill();
}

export function snowRenderer(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let animationFrame: number;

  const flakes = createFlakes();

  const setup = () => {
    const oldWidth = width;
    const oldHeight = height;

    width = globalThis.window.innerWidth;
    height = globalThis.window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    if (oldWidth !== 0 && oldHeight !== 0) {
      flakes.forEach((flake) => {
        flake.x = (flake.x / oldWidth) * width;
        flake.y = (flake.y / oldHeight) * height;
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'white';

    flakes.forEach((flake) => renderFlake(ctx, flake));

    animationFrame = requestAnimationFrame(draw);
  };

  setup();
  draw();

  const unregisterResize = GlobalEventBus.getInstance().register(
    'resize',
    () => setup(),
  );

  return {
    destroy() {
      unregisterResize();
      cancelAnimationFrame(animationFrame);
    },
  };
}
