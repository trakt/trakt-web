import { time } from '$lib/utils/timing/time.ts';

type Point = { readonly x: number; readonly y: number };

type FlyOrbParams = {
  from: Point;
  to: Element;
};

const STEPS = 32;
const DURATION_MS = time.seconds(0.52);
const EASING = 'cubic-bezier(0.3, 0, 0.2, 1)';

function quadratic(a: Point, control: Point, b: Point, t: number): Point {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * control.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * control.y + t * t * b.y,
  };
}

function centre(element: Element): Point {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function spawnOrb({
  size,
  opacity,
  delay,
  path,
}: {
  size: number;
  opacity: number;
  delay: number;
  path: ReadonlyArray<Point & { t: number }>;
}): Animation {
  const orb = document.createElement('span');
  orb.className = 'trakt-onboarding-orb';
  orb.style.width = `${size}px`;
  orb.style.height = `${size}px`;
  orb.style.margin = `${-size / 2}px 0 0 ${-size / 2}px`;
  orb.style.opacity = String(opacity);
  document.body.appendChild(orb);

  const animation = orb.animate(
    path.map((point) => ({
      transform: `translate(${point.x}px, ${point.y}px) scale(${
        1 + Math.sin(point.t * Math.PI) * 0.5
      })`,
      offset: point.t,
    })),
    { duration: DURATION_MS, delay, easing: EASING, fill: 'forwards' },
  );
  animation.onfinish = () => orb.remove();
  animation.oncancel = () => orb.remove();
  return animation;
}

export function flyOrb({ from, to }: FlyOrbParams): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  if (prefersReduced || typeof Element.prototype.animate !== 'function') {
    return Promise.resolve();
  }

  const target = centre(to);
  const control = {
    x: (from.x + target.x) / 2,
    y: Math.min(from.y, target.y) - 160,
  };
  const path = Array.from({ length: STEPS + 1 }, (_, index) => {
    const t = index / STEPS;
    return { ...quadratic(from, control, target, t), t };
  });

  spawnOrb({ size: 10, opacity: 0.5, delay: time.seconds(0.045), path });
  spawnOrb({ size: 7, opacity: 0.3, delay: time.seconds(0.085), path });
  const main = spawnOrb({ size: 18, opacity: 1, delay: 0, path });

  return new Promise((resolve) => {
    main.addEventListener('finish', () => resolve(), { once: true });
    main.addEventListener('cancel', () => resolve(), { once: true });
  });
}
