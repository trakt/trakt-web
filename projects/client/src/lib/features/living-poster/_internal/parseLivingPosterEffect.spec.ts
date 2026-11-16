import { describe, expect, it } from 'vitest';
import { parseLivingPosterEffect } from './parseLivingPosterEffect.ts';

describe('util: parseLivingPosterEffect', () => {
  it('should name the slots of a boxed colored effect', () => {
    expect(
      parseLivingPosterEffect(['fog', '#313538', 0.34, [0, 60, 100, 40]]),
    ).toEqual({
      kind: 'fog',
      color: '#313538',
      intensity: 0.34,
      box: [0, 60, 100, 40],
    });
  });

  it('should cover the whole poster when the box is dropped', () => {
    expect(parseLivingPosterEffect(['dust', null, 0.3])).toEqual({
      kind: 'dust',
      color: null,
      intensity: 0.3,
      box: [0, 0, 100, 100],
    });
  });

  it('should read bulb points from the extra slot', () => {
    expect(
      parseLivingPosterEffect([
        'bulbs',
        '#ffd27a',
        0.6,
        null,
        [
          [10, 20],
          [30, 40],
        ],
      ]),
    ).toEqual({
      kind: 'bulbs',
      color: '#ffd27a',
      intensity: 0.6,
      box: [0, 0, 100, 100],
      points: [
        [10, 20],
        [30, 40],
      ],
    });
  });

  it('should read the flare point from the extra slot', () => {
    expect(
      parseLivingPosterEffect(['flare', null, 0.5, null, [62, 18]]),
    ).toMatchObject({ kind: 'flare', at: [62, 18] });
  });

  it('should keep a letters mask in its positional slot', () => {
    expect(
      parseLivingPosterEffect(['shimmer', null, 0.4, null, 'letters']),
    ).toMatchObject({ kind: 'shimmer', intensity: 0.4 });
  });

  it('should keep a title mask in its positional slot', () => {
    expect(
      parseLivingPosterEffect(['foil', null, 0.7, null, 'title']),
    ).toMatchObject({ kind: 'foil', mask: 'title', intensity: 0.7 });
  });

  it('should drop a masked effect with an unknown or missing mask', () => {
    expect(
      parseLivingPosterEffect(['foil', null, 0.7, null, 'logo']),
    ).toBeNull();
    expect(parseLivingPosterEffect(['foil', null, 0.7])).toBeNull();
  });

  it('should ignore unknown kinds', () => {
    expect(parseLivingPosterEffect(['confetti', null, 0.5])).toBeNull();
  });

  it('should drop tuples without a usable intensity', () => {
    expect(parseLivingPosterEffect(['snow', null, 'high'])).toBeNull();
    expect(parseLivingPosterEffect(['snow'])).toBeNull();
    expect(parseLivingPosterEffect('snow')).toBeNull();
  });

  it('should clamp intensity into the unit range', () => {
    expect(parseLivingPosterEffect(['snow', null, 4])).toMatchObject({
      intensity: 1,
    });
    expect(parseLivingPosterEffect(['snow', null, -2])).toMatchObject({
      intensity: 0,
    });
  });

  it('should reject colors that are not hex values', () => {
    expect(
      parseLivingPosterEffect(['glow', 'red; background: url(x)', 0.5]),
    ).toMatchObject({ color: null });
  });

  it('should drop a hex color with five or seven digits', () => {
    expect(parseLivingPosterEffect(['glow', '#12345', 0.5])).toMatchObject({
      color: null,
    });
    expect(parseLivingPosterEffect(['glow', '#1234567', 0.5])).toMatchObject({
      color: null,
    });
  });

  it('should ignore a color on kinds that carry none', () => {
    expect(parseLivingPosterEffect(['snow', '#ffffff', 0.5])).toMatchObject({
      color: null,
    });
  });

  it('should fall back to the full box when the box is malformed', () => {
    expect(
      parseLivingPosterEffect(['embers', null, 0.5, [1, 2, 3]]),
    ).toMatchObject({ box: [0, 0, 100, 100] });
  });

  it('should drop bulbs without any valid point', () => {
    expect(
      parseLivingPosterEffect(['bulbs', null, 0.5, null, [[1], 'x']]),
    ).toBeNull();
  });

  it('should drop a flare without a point', () => {
    expect(parseLivingPosterEffect(['flare', null, 0.5])).toBeNull();
  });
});
