import type { Particle } from '../models/Particle.ts';
import type { ParticleEffect } from '../models/ParticleEffect.ts';
import { createRandom } from './createRandom.ts';

type Kind = ParticleEffect['kind'];

type CreateParticlesParams = {
  effect: ParticleEffect;
  seed: number;
};

const COUNTS: Record<Kind, number> = {
  embers: 40,
  snow: 46,
  dust: 28,
  rain: 40,
  fireflies: 14,
  twinkle: 18,
};

const COLORS: Record<Kind, string> = {
  embers: '#ffa54a',
  snow: '#ffffff',
  dust: '#f2e7d2',
  rain: '#cfe0ff',
  fireflies: '#e8ff8a',
  twinkle: '#ffffff',
};

type Random = () => number;

const SIZES: Record<Kind, (random: Random) => number> = {
  embers: (random) => 1 + random() * 1.6,
  snow: (random) => 2 + random() * 4,
  dust: (random) => 1 + random() * 2.2,
  rain: () => 1,
  fireflies: (random) => 3 + random() * 3,
  twinkle: (random) => 2 + random() * 2,
};

const DURATIONS: Record<Kind, (random: Random) => number> = {
  embers: (random) => 4 + random() * 5,
  snow: (random) => 7 + random() * 7,
  dust: (random) => 6 + random() * 8,
  rain: (random) => 0.7 + random() * 0.5,
  fireflies: (random) => 2.5 + random() * 3,
  twinkle: (random) => 2 + random() * 3,
};

const STARTS: Record<Kind, (random: Random) => number> = {
  embers: (random) => 70 + random() * 40,
  snow: () => -10,
  dust: (random) => random() * 100,
  rain: () => -10,
  fireflies: (random) => random() * 100,
  twinkle: (random) => random() * 100,
};

export function createParticles({
  effect,
  seed,
}: CreateParticlesParams): ReadonlyArray<Particle> {
  const { kind, box, intensity, color } = effect;
  const random = createRandom(seed);
  const count = Math.round(COUNTS[kind] * (0.5 + intensity));

  return Array.from({ length: count }, () => {
    const x = random() * 100;
    const size = SIZES[kind](random);
    const y = STARTS[kind](random);
    const length = kind === 'rain' ? 14 + random() * 18 : size;
    const dx = (random() - 0.5) * 40;
    const duration = DURATIONS[kind](random);
    const phase = random();

    return {
      kind,
      box,
      x,
      y,
      size,
      length,
      dx,
      duration,
      phase,
      color: color ?? COLORS[kind],
    };
  });
}
