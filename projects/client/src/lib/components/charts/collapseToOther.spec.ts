import { describe, expect, it } from 'vitest';
import { collapseToOther } from './collapseToOther.ts';
import type { SegmentedBarItem } from './models/SegmentedBarProps.ts';

const item = (label: string, value: number): SegmentedBarItem => ({
  label,
  value,
});

describe('util: collapseToOther', () => {
  describe('when items fit within the cap', () => {
    it('should return every item and no Other bucket', () => {
      const items = [item('a', 5), item('b', 3), item('c', 2)];

      const result = collapseToOther(items, 8);

      expect(result.other).toBeNull();
      expect(result.visible).toEqual(items);
    });

    it('should treat an exactly-full bar as a no-op', () => {
      const items = [item('a', 5), item('b', 3)];

      const result = collapseToOther(items, 2);

      expect(result.other).toBeNull();
      expect(result.visible).toHaveLength(2);
    });
  });

  describe('when items exceed the cap', () => {
    const items = [
      item('a', 10),
      item('b', 8),
      item('c', 6),
      item('d', 3),
      item('e', 2),
      item('f', 1),
    ];

    it('should keep the largest categories up to maxSegments - 1', () => {
      const result = collapseToOther(items, 4);

      expect(result.visible.map((i) => i.label)).toEqual(['a', 'b', 'c']);
    });

    it('should preserve the original order of the kept items', () => {
      const unsorted = [
        item('a', 1),
        item('b', 10),
        item('c', 5),
        item('d', 2),
      ];

      // cap 3 keeps the 2 largest (b, c); a + d collapse into Other.
      const result = collapseToOther(unsorted, 3);

      // Original order (b before c) is retained, not value order.
      expect(result.visible.map((i) => i.label)).toEqual(['b', 'c']);
    });

    it('should roll the smallest categories into Other with summed value', () => {
      const result = collapseToOther(items, 4);

      expect(result.other).toEqual({ value: 6, count: 3 });
    });

    it('should collapse everything when the cap is zero or negative', () => {
      const result = collapseToOther(items, 0);

      expect(result.visible).toHaveLength(0);
      expect(result.other).toEqual({ value: 30, count: 6 });
    });

    it('should leave the grand total unchanged across visible + other', () => {
      const result = collapseToOther(items, 4);

      const visibleTotal = result.visible.reduce((t, i) => t + i.value, 0);
      expect(visibleTotal + (result.other?.value ?? 0)).toBe(30);
    });
  });
});
