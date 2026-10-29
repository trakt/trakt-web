import type { TierAuraTier } from '../TierAuraTier.ts';

type Shine = (aura: HTMLElement) => void;

const between = (min: number, max: number) => min + Math.random() * (max - min);

const WHITE = 'var(--aura-white)';
const fade = (share: number) =>
  `color-mix(in srgb, var(--aura-white) ${Math.round(share * 100)}%, transparent)`;

const ringGlint: Shine = (aura) => {
  const ring = aura.querySelector<HTMLElement>('[data-shine="ring"]');
  if (!ring) return;

  const start = between(0, 360);
  const sweep = between(200, 460) * (Math.random() < 0.5 ? 1 : -1);
  const tail = between(30, 110);
  const peak = between(0.7, 1);
  const head = sweep > 0 ? 350 : 10;
  const stops =
    sweep > 0
      ? `transparent ${head - tail}deg, ${fade(peak / 2)} ${head - 8}deg, ${WHITE} ${head}deg, transparent ${head + 6}deg`
      : `transparent ${head - 6}deg, ${WHITE} ${head}deg, ${fade(peak / 2)} ${head + 8}deg, transparent ${head + tail}deg`;

  ring.style.background = `conic-gradient(from 0deg, transparent 0deg, ${stops}, transparent 360deg)`;
  ring.getAnimations().forEach((animation) => animation.cancel());
  ring.animate(
    [
      { transform: `rotate(${start}deg)`, opacity: 0 },
      { opacity: peak, offset: 0.18 },
      { opacity: peak, offset: 0.8 },
      { transform: `rotate(${start + sweep}deg)`, opacity: 0 },
    ],
    { duration: between(800, 1700), easing: 'cubic-bezier(0.45, 0, 0.2, 1)' },
  );
};

const sideGlint: Shine = (aura) => {
  const band = aura.querySelector<HTMLElement>('[data-shine="band"]');
  if (!band) return;

  const angle = between(-35, 35) + (Math.random() < 0.5 ? 0 : 180);
  const width = between(0.8, 1.3);
  band.animate(
    [
      {
        transform: `rotate(${angle}deg) translateX(-45%) scaleX(${width})`,
        opacity: 0,
      },
      { opacity: between(0.7, 1), offset: 0.35 },
      { opacity: between(0.6, 0.9), offset: 0.65 },
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

const sparkles: Shine = (aura) => {
  const box = aura.querySelector<HTMLElement>('[data-shine="sparks"]');
  if (!box) return;

  const centre = aura.offsetWidth / 2;
  const count = 3 + Math.floor(Math.random() * 3);
  const base = between(0, 360);
  box.replaceChildren();

  Array.from({ length: count }, (_, index) => index).forEach((index) => {
    const angle =
      ((base + index * (360 / count) + between(-25, 25)) * Math.PI) / 180;
    const radius = centre + between(3, 8);
    const size = between(5, 10) * Math.min(1, centre / 22);
    const spark = document.createElement('span');
    spark.className = 'shine-spark';
    spark.style.inlineSize = `${size}px`;
    spark.style.blockSize = `${size}px`;
    spark.style.left = `${centre + Math.cos(angle) * radius - size / 2}px`;
    spark.style.top = `${centre + Math.sin(angle) * radius - size / 2}px`;
    box.append(spark);

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

const SHINES: Record<TierAuraTier, ReadonlyArray<Shine>> = {
  free: [],
  vip: [ringGlint],
  pro: [sideGlint],
  veteran: [sideGlint, ringGlint],
  elite: [sparkles],
  legend: [sparkles, ringGlint],
  director: [sideGlint, sparkles],
};

export function playAuraShine(aura: HTMLElement, tier: TierAuraTier) {
  SHINES[tier].forEach((shine) => shine(aura));
}
