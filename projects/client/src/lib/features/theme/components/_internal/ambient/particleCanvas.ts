import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import type {
  Particle,
  ParticleBounds,
  ParticlePainter,
} from './ParticlePainter.ts';

function readColors(canvas: HTMLCanvasElement, tokens: ReadonlyArray<string>) {
  const style = getComputedStyle(canvas);

  return tokens
    .map((token) => style.getPropertyValue(token).trim())
    .filter((color) => color.length > 0);
}

function particleCount<P extends Particle>(
  painter: ParticlePainter<P>,
  { width, height }: ParticleBounds,
) {
  return Math.min(
    painter.maxCount,
    Math.round((width * height) / painter.areaPerParticle),
  );
}

export function particleCanvas<P extends Particle>(
  canvas: HTMLCanvasElement,
  painter: ParticlePainter<P>,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const bounds: ParticleBounds = { width: 0, height: 0 };
  let colors = readColors(canvas, painter.colorTokens);
  let particles: P[] = [];
  let animationFrame = 0;

  const setup = () => {
    const previous = { ...bounds };

    bounds.width = globalThis.window.innerWidth;
    bounds.height = globalThis.window.innerHeight;
    canvas.width = bounds.width;
    canvas.height = bounds.height;

    if (particles.length === 0) {
      particles = Array.from(
        { length: particleCount(painter, bounds) },
        () => painter.create({ bounds, colors, isInitial: true }),
      );
      return;
    }

    particles.forEach((particle) => {
      particle.x = (particle.x / previous.width) * bounds.width;
      particle.y = (particle.y / previous.height) * bounds.height;
    });
  };

  const draw = () => {
    ctx.clearRect(0, 0, bounds.width, bounds.height);

    particles.forEach((particle, index) => {
      const isAlive = painter.step(particle, bounds);
      const next = isAlive
        ? particle
        : painter.create({ bounds, colors, isInitial: false });

      if (!isAlive) particles[index] = next;
      painter.draw(ctx, next);
    });

    animationFrame = requestAnimationFrame(draw);
  };

  setup();
  draw();

  const unregisterResize = GlobalEventBus.getInstance().register(
    'resize',
    () => setup(),
  );

  const themeObserver = new MutationObserver(() => {
    colors = readColors(canvas, painter.colorTokens);
    particles = particles.map(() =>
      painter.create({ bounds, colors, isInitial: true })
    );
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  return {
    destroy() {
      unregisterResize();
      themeObserver.disconnect();
      cancelAnimationFrame(animationFrame);
    },
  };
}
