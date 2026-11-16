import { describe, expect, it } from 'vitest';
import type { Particle } from '../models/Particle.ts';
import { createParticles } from './createParticles.ts';
import { particleFrame } from './particleFrame.ts';

const particle = (overrides: Partial<Particle>): Particle => ({
  kind: 'embers',
  box: [0, 0, 100, 100],
  x: 50,
  y: 80,
  size: 2,
  length: 2,
  dx: 10,
  duration: 10,
  phase: 0,
  color: '#ffa54a',
  ...overrides,
});

describe('util: particleFrame', () => {
  it('should start embers invisible and rise while fading in', () => {
    expect(particleFrame({ particle: particle({}), seconds: 0 })).toMatchObject(
      {
        x: 50,
        y: 80,
        opacity: 0,
        scale: 1,
      },
    );

    const early = particleFrame({ particle: particle({}), seconds: 1.2 });
    expect(early.opacity).toBeCloseTo(1, 5);
    expect(early.y).toBeLessThan(80);
  });

  it('should end embers small and transparent at the top of the cycle', () => {
    const late = particleFrame({ particle: particle({}), seconds: 9.99 });

    expect(late.opacity).toBeCloseTo(0, 1);
    expect(late.scale).toBeCloseTo(0.4, 1);
  });

  it('should loop with the cycle duration', () => {
    const first = particleFrame({ particle: particle({}), seconds: 3 });
    const second = particleFrame({ particle: particle({}), seconds: 13 });

    expect(second.y).toBeCloseTo(first.y, 5);
  });

  it('should start a cycle part way in when given a phase', () => {
    const shifted = particleFrame({
      particle: particle({ phase: 0.5 }),
      seconds: 0,
    });
    const halfway = particleFrame({ particle: particle({}), seconds: 5 });

    expect(shifted).toEqual(halfway);
  });

  it('should fall snow from above the box to below it', () => {
    const snow = particle({ kind: 'snow', y: -10 });

    expect(particleFrame({ particle: snow, seconds: 0 }).y).toBe(-20);
    expect(particleFrame({ particle: snow, seconds: 9.99 }).y).toBeGreaterThan(
      100,
    );
  });

  it('should tilt rain streaks and drift them left', () => {
    const frame = particleFrame({
      particle: particle({ kind: 'rain', duration: 1 }),
      seconds: 0.5,
    });

    expect(frame.rotation).toBe(12);
    expect(frame.x).toBeLessThan(50);
  });

  it('should pulse fireflies in place', () => {
    const firefly = particle({ kind: 'fireflies' });

    expect(particleFrame({ particle: firefly, seconds: 0 }).opacity).toBe(0);
    expect(particleFrame({ particle: firefly, seconds: 5 })).toMatchObject({
      x: 50,
      y: 80,
      opacity: 1,
      scale: 1,
    });
  });

  it('should float dust back to where it started', () => {
    const dust = particle({ kind: 'dust' });
    const middle = particleFrame({ particle: dust, seconds: 5 });

    expect(middle.x).toBeCloseTo(60, 5);
    expect(middle.y).toBeCloseTo(74, 5);
    expect(particleFrame({ particle: dust, seconds: 0 }).opacity).toBeCloseTo(
      0.15,
      5,
    );
  });
});

describe('util: createParticles', () => {
  const effect = {
    kind: 'snow' as const,
    color: null,
    intensity: 0.5,
    box: [0, 0, 100, 100] as const,
  };

  it('should scale the count with intensity', () => {
    const calm = createParticles({
      effect: { ...effect, intensity: 0 },
      seed: 1,
    });
    const stormy = createParticles({
      effect: { ...effect, intensity: 1 },
      seed: 1,
    });

    expect(calm).toHaveLength(23);
    expect(stormy).toHaveLength(69);
  });

  it('should be deterministic for a seed', () => {
    expect(createParticles({ effect, seed: 7 })).toEqual(
      createParticles({ effect, seed: 7 }),
    );
    expect(createParticles({ effect, seed: 7 })).not.toEqual(
      createParticles({ effect, seed: 8 }),
    );
  });

  it('should use the effect color or fall back to the kind color', () => {
    expect(createParticles({ effect, seed: 1 }).at(0)?.color).toBe('#ffffff');
    expect(
      createParticles({ effect: { ...effect, color: '#112233' }, seed: 1 }).at(
        0,
      )?.color,
    ).toBe('#112233');
  });

  it('should start embers in the lower part of the box', () => {
    const embers = createParticles({
      effect: { ...effect, kind: 'embers' },
      seed: 3,
    });

    expect(embers.every(({ y }) => y >= 70)).toBe(true);
  });
});
