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

const masked = (kind: 'foil' | 'shimmer', mask: 'letters' | 'title') =>
  ({ ...effect(kind), mask }) as LivingPosterEffect;

const titledLayers = [...layers, { src: 'title.webp', shift: 1 }];

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
      'particles',
      'layer',
    ]);
  });

  it('should split screen blended particles from normal ones', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers,
      effects: [effect('embers'), effect('snow'), effect('fireflies')],
    });
    const groups = stack.flatMap((item) =>
      item.type === 'particles'
        ? [[item.isScreen, item.effects.map(({ kind }) => kind)]]
        : [],
    );

    expect(groups).toEqual([
      [true, ['embers', 'fireflies']],
      [false, ['snow']],
    ]);
  });

  it('should draw behind effects before the figures layer', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers: titledLayers,
      effects: [effect('fog'), effect('dust')],
    });

    expect(stack.map(describeItem)).toEqual([
      'layer',
      'layer',
      'effect:fog',
      'particles',
      'layer',
      'layer',
    ]);
  });

  it('should draw fire flicker and lamp glow behind the figures', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers: titledLayers,
      effects: [effect('flicker'), effect('glow')],
    });

    expect(stack.map(describeItem)).toEqual([
      'layer',
      'layer',
      'effect:flicker',
      'effect:glow',
      'layer',
      'layer',
    ]);
  });

  it('should draw a title masked foil in front at the title shift', () => {
    const stack = composeLivingPosterStack({
      mask: 'm.webp',
      layers: titledLayers,
      effects: [masked('foil', 'title'), masked('shimmer', 'letters')],
    });

    expect(stack.map(describeItem)).toEqual([
      'layer',
      'effect:shimmer',
      'layer',
      'layer',
      'layer',
      'effect:foil',
    ]);
    expect(stack.at(-1)?.shift).toBe(1);
  });

  it('should move a title masked foil with an edge title that moves less', () => {
    const stack = composeLivingPosterStack({
      mask: 'm.webp',
      layers: [...layers, { src: 'title.webp', shift: 0.3 }],
      effects: [masked('foil', 'title'), effect('flare')],
    });
    const shifts = stack
      .filter((item) => item.type === 'effect')
      .map(({ shift }) => shift);

    expect(shifts).toEqual([0.3, -0.6]);
  });

  it('should group effects by where they sit in the depth', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers,
      effects: [
        effect('lightning'),
        effect('fog'),
        effect('bulbs'),
        masked('foil', 'letters'),
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
      effects: [effect('flare'), effect('foil')],
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

  it('should cast shadows from the figures and title layers only', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers: titledLayers,
      effects: [],
    });

    expect(stack.map((item) => item.type === 'layer' && item.isCutout)).toEqual(
      [false, false, true, true],
    );
  });

  it('should fall back to the top layer for unknown shifts', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers: [
        { src: 'a.webp', shift: -0.8 },
        { src: 'b.webp', shift: 0.2 },
      ],
      effects: [effect('embers')],
    });

    expect(stack.map(describeItem)).toEqual(['layer', 'particles', 'layer']);
    expect(stack.map((item) => item.type === 'layer' && item.isCutout)).toEqual(
      [false, false, true],
    );
  });

  it('should hand each masked effect its mask source', () => {
    const stack = composeLivingPosterStack({
      layers,
      mask: 'm.webp',
      effects: [masked('shimmer', 'letters'), masked('foil', 'title')],
    });
    const masks = stack.flatMap((item) =>
      item.type === 'effect' ? [item.mask] : [],
    );

    expect(masks).toEqual(['m.webp', 'fg.webp']);
  });
});
