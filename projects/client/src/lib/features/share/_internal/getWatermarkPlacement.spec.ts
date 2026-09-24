import { describe, expect, it } from 'vitest';
import { SHARE_TYPE_DIMENSIONS, type ShareType } from '../models/ShareType.ts';
import { getWatermarkPlacement } from './getWatermarkPlacement.ts';

function toNumbers(value: string): ReadonlyArray<number> {
  return value.match(/-?[\d.]+/g)?.map(Number) ?? [];
}

describe('util: getWatermarkPlacement', () => {
  const variants: ReadonlyArray<ShareType> = ['open-graph', 'feed', 'story'];

  it.each(variants)('should keep the %s box inside the canvas', (variant) => {
    const { width, height } = SHARE_TYPE_DIMENSIONS[variant];
    const [top, left, boxWidth, boxHeight] = toNumbers(
      getWatermarkPlacement(variant).style,
    );

    expect(top).toBeGreaterThanOrEqual(0);
    expect(left).toBeGreaterThanOrEqual(0);
    expect((left ?? 0) + (boxWidth ?? 0)).toBeLessThanOrEqual(width);
    expect((top ?? 0) + (boxHeight ?? 0)).toBeLessThanOrEqual(height);
  });

  it.each(variants)(
    'should keep the %s view box inside the logo',
    (variant) => {
      const [x, y, viewWidth, viewHeight] = toNumbers(
        getWatermarkPlacement(variant).viewBox,
      );

      expect(x).toBeGreaterThanOrEqual(-40);
      expect(y).toBeGreaterThanOrEqual(-185);
      expect((x ?? 0) + (viewWidth ?? 0)).toBeLessThanOrEqual(632);
      expect((y ?? 0) + (viewHeight ?? 0)).toBeLessThanOrEqual(525);
    },
  );

  it.each(variants)(
    'should scale the %s logo evenly so it stays round',
    (variant) => {
      const { style, viewBox } = getWatermarkPlacement(variant);
      const [, , boxWidth = 0, boxHeight = 0] = toNumbers(style);
      const [, , viewWidth = 1, viewHeight = 1] = toNumbers(viewBox);

      expect(boxWidth / viewWidth).toBeCloseTo(boxHeight / viewHeight, 2);
    },
  );

  describe('story', () => {
    it('should crop away the part that falls off the canvas', () => {
      const { style, viewBox } = getWatermarkPlacement('story');

      expect(style).toBe(
        'top: 96px; left: 0px; width: 1080px; height: 1824px;',
      );
      expect(viewBox).toBe('116.281 -185 399.375 674.5');
    });
  });
});
