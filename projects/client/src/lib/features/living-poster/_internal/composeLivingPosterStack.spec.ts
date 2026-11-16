import { describe, expect, it } from 'vitest';
import type { LivingPosterEffect } from '../models/LivingPosterEffect.ts';
import { composeLivingPosterStack } from './composeLivingPosterStack.ts';

const box = [0, 0, 100, 100] as const;
const effect = (kind: LivingPosterEffect['kind']) =>
  ({
    kind,
    color: null,
    intensity: 0.5,
    box,
    points: [[1, 1]],
    at: [1, 1],
  }) as LivingPosterEffect;

const layers = [
  { src: 'bg.webp', shift: -1 },
  { src: 'mid.webp', shift: -0.35 },
  { src: 'fg.webp', shift: 0.55 },
];

const describeItem = (
  item: ReturnType<typeof composeLivingPosterStack>[number],
) => (item.type === 'effect' ? `${item.type}:${item.effect.kind}` : item.type);

describe('util: composeLivingPosterStack', () => {
  it('should keep layers in order when there are no effects', () => {
    const stack = composeLivingPosterStack({ mask: null, layers, effects: [] });

    expect(stack.map(({ type }) => type)).toEqual(['layer', 'layer', 'layer']);
  });

  it('should put particles behind the top layer', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers,
      effects: [effect('embers'), effect('snow')],
    });

    expect(stack.map(describeItem)).toEqual([
      'layer',
      'layer',
      'particles',
      'layer',
    ]);
    const particles = stack.find(({ type }) => type === 'particles');
    expect(particles?.type === 'particles' && particles.effects).toHaveLength(
      2,
    );
  });

  it('should group effects by where they sit in the depth', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers,
      effects: [
        effect('lightning'),
        effect('fog'),
        effect('bulbs'),
        effect('foil'),
        effect('embers'),
      ],
    });

    expect(stack.map(describeItem)).toEqual([
      'layer',
      'effect:bulbs',
      'effect:foil',
      'layer',
      'effect:fog',
      'particles',
      'layer',
      'effect:lightning',
    ]);
  });

  it('should share the background parallax with background effects', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers,
      effects: [effect('bulbs')],
    });
    const bulbs = stack.find(({ type }) => type === 'effect');

    expect(bulbs?.shift).toBe(-1);
  });

  it('should push flares back and other front effects forward', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers,
      effects: [effect('flare'), effect('glow')],
    });
    const shifts = stack
      .filter((item) => item.type === 'effect')
      .map(({ shift }) => shift);

    expect(shifts).toEqual([-0.6, 1]);
  });

  it('should draw behind effects over a single layer', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers: [layers[0]],
      effects: [effect('fog')],
    });

    expect(stack.map(describeItem)).toEqual(['layer', 'effect:fog']);
  });

  it('should only mark the top layer of a cutout stack as a cutout', () => {
    const stack = composeLivingPosterStack({ mask: null, layers, effects: [] });

    expect(stack.map((item) => item.type === 'layer' && item.isCutout)).toEqual(
      [false, false, true],
    );
  });

  it('should hand each masked effect its mask source', () => {
    const stack = composeLivingPosterStack({
      layers,
      mask: 'm.webp',
      effects: [
        { ...effect('shimmer'), mask: 'letters' } as LivingPosterEffect,
        { ...effect('foil'), mask: 'title' } as LivingPosterEffect,
      ],
    });
    const masks = stack.flatMap((item) =>
      item.type === 'effect' ? [item.mask] : [],
    );

    expect(masks).toEqual(['m.webp', 'fg.webp']);
  });
});
