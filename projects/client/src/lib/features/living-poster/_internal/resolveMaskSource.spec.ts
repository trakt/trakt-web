import { describe, expect, it } from 'vitest';
import type { LivingPosterEffect } from '../models/LivingPosterEffect.ts';
import { resolveMaskSource } from './resolveMaskSource.ts';

const poster = {
  layers: [
    { src: 'bg.webp', shift: -1 },
    { src: 'figures.webp', shift: 0.2 },
    { src: 'title.webp', shift: 0.5 },
  ],
  mask: 'm.webp',
};

const effect = (kind: 'foil' | 'shimmer' | 'fog', mask?: 'letters' | 'title') =>
  ({
    kind,
    mask,
    color: null,
    intensity: 0.5,
    box: [0, 0, 100, 100],
  }) as LivingPosterEffect;

describe('util: resolveMaskSource', () => {
  it('should use the manifest mask file for the letters mask', () => {
    expect(
      resolveMaskSource({ effect: effect('foil', 'letters'), poster }),
    ).toBe('m.webp');
  });

  it('should use the last layer for the title mask', () => {
    expect(
      resolveMaskSource({ effect: effect('shimmer', 'title'), poster }),
    ).toBe('title.webp');
  });

  it('should not mask effects that carry no mask', () => {
    expect(resolveMaskSource({ effect: effect('fog'), poster })).toBeNull();
  });
});
