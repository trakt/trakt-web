import type { UserTier } from '../UserTier.ts';

type Shine = (ring: HTMLElement) => void;

const between = (min: number, max: number) => min + Math.random() * (max - min);

const LIGHT = 'var(--shine-light, var(--shade-10))';
const fade = (share: number) =>
  `color-mix(in srgb, ${LIGHT} ${Math.round(share * 100)}%, transparent)`;

const ringGlint: Shine = (ring) => {
  const glint = ring.querySelector<HTMLElement>('[data-shine="ring"]');
  if (!glint) return;

  const start = between(0, 360);
  const sweep = between(200, 460) * (Math.random() < 0.5 ? 1 : -1);
  const tail = between(30, 110);
  const peak = between(0.7, 1);
  const head = sweep > 0 ? 350 : 10;
  const stops =
    sweep > 0
      ? `transparent ${head - tail}deg, ${fade(peak / 2)} ${head - 8}deg, ${LIGHT} ${head}deg, transparent ${head + 6}deg`
      : `transparent ${head - 6}deg, ${LIGHT} ${head}deg, ${fade(peak / 2)} ${head + 8}deg, transparent ${head + tail}deg`;

  glint.style.background = `conic-gradient(from 0deg, transparent 0deg, ${stops}, transparent 360deg)`;
  glint.getAnimations().forEach((animation) => animation.cancel());
  glint.animate(
    [
      { transform: `rotate(${start}deg)`, opacity: 0 },
      { opacity: peak, offset: 0.18 },
      { opacity: peak, offset: 0.8 },
      { transform: `rotate(${start + sweep}deg)`, opacity: 0 },
    ],
    { duration: between(800, 1700), easing: 'cubic-bezier(0.45, 0, 0.2, 1)' },
  );
};

const sideGlint: Shine = (ring) => {
  const band = ring.querySelector<HTMLElement>('[data-shine="band"]');
  if (!band) return;

  const angle = between(-35, 35) + (Math.random() < 0.5 ? 0 : 180);
  const width = between(0.8, 1.3);
  band.getAnimations().forEach((animation) => animation.cancel());
  band.animate(
    [
      {
        transform: `rotate(${angle}deg) translateX(-45%) scaleX(${width})`,
        opacity: 0,
      },
      { opacity: between(0.5, 0.8), offset: 0.35 },
      { opacity: between(0.4, 0.7), offset: 0.65 },
      {
        transform: `rotate(${angle}deg) translateX(45%) scaleX(${width})`,
        opacity: 0,
      },
    ],
    {
      duration: between(650, 1100),
      easing: 'cubic-bezier(0.3, 0.1, 0.2, 1)',
      delay: between(0, 120),
    },
  );
};

const SPARK_PATH =
  'M0 -0.5L0.1 -0.1L0.5 0L0.1 0.1L0 0.5L-0.1 0.1L-0.5 0L-0.1 -0.1Z';

const sparkles: Shine = (ring) => {
  const box = ring.querySelector<SVGSVGElement>('[data-shine="sparks"]');
  if (!box) return;

  const centre = ring.offsetWidth / 2;
  const count = 3 + Math.floor(Math.random() * 3);
  const base = between(0, 360);
  box.replaceChildren();

  Array.from({ length: count }, (_, index) => index).forEach((index) => {
    const angle =
      ((base + index * (360 / count) + between(-25, 25)) * Math.PI) / 180;
    const size = between(5, 9) * Math.min(1, centre / 22);
    const radius = centre + between(2, 6);
    const x = centre + Math.cos(angle) * radius;
    const y = centre + Math.sin(angle) * radius;

    const spot = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    spot.setAttribute('transform', `translate(${x} ${y}) scale(${size})`);
    const spark = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    );
    spark.setAttribute('class', 'shine-spark');
    spark.setAttribute('d', SPARK_PATH);
    spot.append(spark);
    box.append(spot);

    spark.animate(
      [
        { transform: 'scale(0) rotate(0deg)', opacity: 0 },
        { transform: 'scale(1) rotate(45deg)', opacity: 1, offset: 0.45 },
        { transform: 'scale(0) rotate(90deg)', opacity: 0 },
      ],
      {
        duration: between(500, 800),
        easing: 'ease-out',
        delay: index * between(60, 140),
      },
    );
  });
};

const SHINES: Record<UserTier, ReadonlyArray<Shine>> = {
  free: [ringGlint],
  vip: [ringGlint],
  pro: [sideGlint],
  veteran: [sideGlint, ringGlint],
  elite: [sparkles],
  legend: [sparkles, ringGlint],
};

function isShining(ring: HTMLElement) {
  return Array.from(
    ring.querySelectorAll<HTMLElement>('[data-shine], .shine-spark'),
  ).some((element) => element.getAnimations().length > 0);
}

export function playUserTierShine(ring: HTMLElement, tier: UserTier) {
  if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  if (typeof ring.getAnimations !== 'function') return;
  if (isShining(ring)) return;

  SHINES[tier].forEach((shine) => shine(ring));
}
