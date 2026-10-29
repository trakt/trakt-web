type FlightPath = {
  from: DOMRect;
  to: DOMRect;
};

type FlyPosterParams = FlightPath & {
  src: string;
  isReducedMotion: boolean;
};

const STEPS = 24;
const DURATION = 560;
const LIFT = 70;
const TILT = 8;
const FROM_RADIUS = 12;
const TO_RADIUS = 4;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export function toFlightKeyframes({ from, to }: FlightPath): Keyframe[] {
  const scale = to.width / from.width;
  const direction = to.left >= from.left ? 1 : -1;

  return Array.from({ length: STEPS + 1 }, (_, step) => {
    const t = step / STEPS;
    const eased = easeOutCubic(t);
    const arc = Math.sin(t * Math.PI);
    const x = from.left + (to.left - from.left) * eased;
    const y = from.top + (to.top - from.top) * eased - arc * LIFT;
    const size = 1 + (scale - 1) * t ** 1.4;
    const rotation = arc * TILT * direction;
    const radius = (FROM_RADIUS - (FROM_RADIUS - TO_RADIUS) * t) / size;

    return {
      transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${size})`,
      borderRadius: `${radius}px`,
      offset: t,
    };
  });
}

export function flyPosterToSlot({
  from,
  to,
  src,
  isReducedMotion,
}: FlyPosterParams): Promise<void> {
  if (isReducedMotion || typeof document === 'undefined') {
    return Promise.resolve();
  }

  const ghost = document.createElement('img');
  ghost.src = src;
  ghost.alt = '';
  ghost.setAttribute('aria-hidden', 'true');
  Object.assign(ghost.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: `${from.width}px`,
    height: `${from.height}px`,
    objectFit: 'cover',
    transformOrigin: '0 0',
    pointerEvents: 'none',
    zIndex: 'var(--layer-top)',
    boxShadow: 'var(--shadow-raised)',
  });
  document.body.append(ghost);

  return new Promise((resolve) => {
    const animation = ghost.animate(toFlightKeyframes({ from, to }), {
      duration: DURATION,
      easing: 'cubic-bezier(0.45, 0, 0.25, 1)',
      fill: 'forwards',
    });
    const finish = () => {
      ghost.remove();
      resolve();
    };
    animation.onfinish = finish;
    animation.oncancel = finish;
  });
}
