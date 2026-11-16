import { describe, expect, it } from 'vitest';
import { parseLivingPoster } from './parseLivingPoster.ts';

const BASE_URL = 'https://media.trakt.tv/movies/1/live';

const manifest = {
  v: 1,
  w: 800,
  h: 1200,
  layers: [
    ['00.webp', -1.0],
    ['01.webp', -0.35],
    ['02.webp', 0.55],
  ],
  mask: 'm.webp',
  effects: [
    ['fog', '#313538', 0.34, [0, 60, 100, 40]],
    ['shimmer', null, 0.4, null, 'letters'],
  ],
};

describe('util: parseLivingPoster', () => {
  it('should resolve layers and mask next to the manifest', () => {
    const poster = parseLivingPoster({ raw: manifest, baseUrl: BASE_URL });

    expect(poster?.layers).toEqual([
      { src: `${BASE_URL}/00.webp`, shift: -1 },
      { src: `${BASE_URL}/01.webp`, shift: -0.35 },
      { src: `${BASE_URL}/02.webp`, shift: 0.55 },
    ]);
    expect(poster?.mask).toBe(`${BASE_URL}/m.webp`);
    expect(poster?.effects.map(({ kind }) => kind)).toEqual(['fog', 'shimmer']);
  });

  it('should parse a manifest without effects or mask', () => {
    const poster = parseLivingPoster({
      raw: { v: 1, layers: [['00.webp', -1]] },
      baseUrl: BASE_URL,
    });

    expect(poster).toEqual({
      layers: [{ src: `${BASE_URL}/00.webp`, shift: -1 }],
      mask: null,
      effects: [],
    });
  });

  it('should skip unknown and malformed effects but keep the rest', () => {
    const poster = parseLivingPoster({
      raw: {
        ...manifest,
        effects: [['confetti', null, 1], 7, ['snow', null, 0.5]],
      },
      baseUrl: BASE_URL,
    });

    expect(poster?.effects.map(({ kind }) => kind)).toEqual(['snow']);
  });

  it('should drop mask effects when the manifest has no mask file', () => {
    const poster = parseLivingPoster({
      raw: { ...manifest, mask: undefined },
      baseUrl: BASE_URL,
    });

    expect(poster?.mask).toBeNull();
    expect(poster?.effects.map(({ kind }) => kind)).toEqual(['fog']);
  });

  it('should keep title mask effects when there is a title layer', () => {
    const poster = parseLivingPoster({
      raw: {
        ...manifest,
        mask: undefined,
        effects: [['foil', null, 0.7, null, 'title']],
      },
      baseUrl: BASE_URL,
    });

    expect(poster?.effects).toMatchObject([{ kind: 'foil', mask: 'title' }]);
  });

  it('should drop title mask effects over a single layer', () => {
    const poster = parseLivingPoster({
      raw: {
        v: 1,
        layers: [['00.webp', -1]],
        effects: [['foil', null, 0.7, null, 'title']],
      },
      baseUrl: BASE_URL,
    });

    expect(poster?.effects).toEqual([]);
  });

  it('should clamp wild parallax factors', () => {
    const poster = parseLivingPoster({
      raw: {
        v: 1,
        layers: [
          ['00.webp', -40],
          ['01.webp', 40],
        ],
      },
      baseUrl: BASE_URL,
    });

    expect(poster?.layers.map(({ shift }) => shift)).toEqual([-1.5, 1.5]);
  });

  it('should reject an unknown version', () => {
    expect(
      parseLivingPoster({ raw: { ...manifest, v: 2 }, baseUrl: BASE_URL }),
    ).toBeNull();
  });

  it('should reject layer names that escape the folder', () => {
    expect(
      parseLivingPoster({
        raw: { v: 1, layers: [['../00.webp', 0]] },
        baseUrl: BASE_URL,
      }),
    ).toBeNull();
  });

  it('should reject a manifest without layers', () => {
    expect(
      parseLivingPoster({ raw: { v: 1, layers: [] }, baseUrl: BASE_URL }),
    ).toBeNull();
    expect(parseLivingPoster({ raw: null, baseUrl: BASE_URL })).toBeNull();
  });
});
