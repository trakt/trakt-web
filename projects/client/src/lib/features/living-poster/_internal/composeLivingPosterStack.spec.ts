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
) => {
  if (item.type === 'effect') return `effect:${item.effect.kind}`;
  if (item.type === 'canvas') return `canvas:${item.plane}`;
  return item.type;
};

describe('util: composeLivingPosterStack', () => {
  it('should keep layers in order when there are no effects', () => {
    const stack = composeLivingPosterStack({ mask: null, layers, effects: [] });

    expect(stack.map(({ type }) => type)).toEqual(['layer', 'layer', 'layer']);
  });

  it('should paint canvas effects behind the top layer', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers,
      effects: [effect('embers'), effect('snow')],
    });

    expect(stack.map(describeItem)).toEqual([
      'layer',
      'layer',
      'canvas:back',
      'canvas:back',
      'layer',
      'canvas:front',
    ]);
  });

  it('should split screen blended canvas effects from normal ones', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers,
      effects: [effect('embers'), effect('snow'), effect('fireflies')],
    });
    const groups = stack.flatMap((item) =>
      item.type === 'canvas' && item.plane === 'back'
        ? [[item.isScreen, item.effects.map(({ effect }) => effect.kind)]]
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
      effects: [effect('haze'), effect('dust')],
    });

    expect(stack.map(describeItem)).toEqual([
      'layer',
      'layer',
      'effect:haze',
      'canvas:back',
      'layer',
      'layer',
      'canvas:front',
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
      .filter((item) => item.type !== 'layer')
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
      'canvas:back',
      'layer',
      'canvas:rim',
      'canvas:front',
    ]);
  });

  it('should rim the figures with lightning at the figures shift', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers: titledLayers,
      effects: [effect('lightning')],
    });
    const rim = stack.find(
      (item) => item.type === 'canvas' && item.plane === 'rim',
    );

    expect(stack.map(describeItem)).toEqual([
      'layer',
      'layer',
      'canvas:back',
      'layer',
      'canvas:rim',
      'layer',
      'canvas:front',
    ]);
    expect(rim?.shift).toBe(0.55);
  });

  it('should skip the rim when no layer holds the figures', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers: [
        { src: 'a.webp', shift: -0.8 },
        { src: 'b.webp', shift: 0.2 },
      ],
      effects: [effect('lightning')],
    });

    expect(stack.map(describeItem)).toEqual([
      'layer',
      'canvas:back',
      'layer',
      'canvas:front',
    ]);
  });

  it('should seed every plane of one effect the same', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers,
      effects: [effect('embers'), effect('rain'), effect('lightning')],
    });
    const seeds = stack.flatMap((item) =>
      item.type === 'canvas'
        ? item.effects
            .filter(({ effect }) => effect.kind === 'lightning')
            .map(({ seed }) => seed)
        : [],
    );

    expect(seeds).toEqual([244, 244, 244]);
  });

  it('should hand canvas effects the backdrop and figures sources', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers: titledLayers,
      effects: [effect('twinkle')],
    });
    const canvas = stack.find((item) => item.type === 'canvas');

    expect(canvas?.type === 'canvas' && canvas.sources).toEqual({
      backdrop: 'bg.webp',
      figures: 'fg.webp',
    });
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
      .filter((item) => item.type !== 'layer')
      .map(({ shift }) => shift);

    expect(shifts).toEqual([1, -0.6]);
  });

  it('should draw behind effects over a single layer', () => {
    const stack = composeLivingPosterStack({
      mask: null,
      layers: [layers[0]],
      effects: [effect('glow')],
    });

    expect(stack.map(describeItem)).toEqual(['layer', 'effect:glow']);
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

    expect(stack.map(describeItem)).toEqual(['layer', 'canvas:back', 'layer']);
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
