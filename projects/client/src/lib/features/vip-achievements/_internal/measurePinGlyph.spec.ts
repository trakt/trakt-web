import { describe, expect, it } from 'vitest';
import { measurePinGlyph } from './measurePinGlyph.ts';
import { pinPaths } from './pinPaths.ts';

const near = (value: number) => expect.closeTo(value, 1);

describe('util: measurePinGlyph', () => {
  it('should measure straight edges exactly', () => {
    expect(
      measurePinGlyph({ shapes: [{ kind: 'fill', d: 'M10 20H60V50H10Z' }] }),
    ).toEqual({ x: 10, y: 20, width: 50, height: 30 });
  });

  it('should follow arcs out to their full extent', () => {
    expect(
      measurePinGlyph({
        shapes: [{ kind: 'fill', d: pinPaths.circle(50, 50, 20) }],
      }),
    ).toEqual({ x: near(30), y: near(30), width: near(40), height: near(40) });
  });

  it('should include half of a stroke on every side', () => {
    expect(
      measurePinGlyph({
        shapes: [{ kind: 'stroke', d: 'M20 50H80', width: 6 }],
      }),
    ).toEqual({ x: 17, y: 47, width: 66, height: 6 });
  });

  it('should apply the rotation of a part', () => {
    const bounds = measurePinGlyph({
      shapes: [
        { kind: 'fill', d: 'M40 10H60V90H40Z', transform: 'rotate(90 50 50)' },
      ],
    });
    expect(bounds).toEqual({
      x: near(10),
      y: near(40),
      width: near(80),
      height: near(20),
    });
  });
});
