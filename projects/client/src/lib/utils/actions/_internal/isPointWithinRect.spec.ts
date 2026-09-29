import { describe, expect, it } from 'vitest';
import { isPointWithinRect } from './isPointWithinRect.ts';

const rect = { left: 100, right: 200, top: 50, bottom: 250 };

describe('util: isPointWithinRect', () => {
  it('should include points inside and on the edge', () => {
    expect(isPointWithinRect({ rect, x: 150, y: 100 })).toBe(true);
    expect(isPointWithinRect({ rect, x: 100, y: 50 })).toBe(true);
  });

  it('should exclude points outside', () => {
    expect(isPointWithinRect({ rect, x: 99, y: 100 })).toBe(false);
    expect(isPointWithinRect({ rect, x: 150, y: 251 })).toBe(false);
  });

  it('should grow the area by the margin', () => {
    expect(isPointWithinRect({ rect, x: 90, y: 100, margin: 12 })).toBe(true);
    expect(isPointWithinRect({ rect, x: 80, y: 100, margin: 12 })).toBe(false);
  });
});
