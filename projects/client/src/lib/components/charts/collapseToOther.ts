import { sum } from '$lib/utils/number/sum.ts';
import type { SegmentedBarItem } from './models/SegmentedBarProps.ts';

export type CollapsedSegments = {
  /** Categories kept as their own segment, in original input order. */
  visible: SegmentedBarItem[];
  /** Rolled-up tail, or `null` when nothing was collapsed. */
  other: { value: number; count: number } | null;
};

/**
 * Cap a segmented bar at `maxSegments` by rolling the smallest-by-value
 * categories past the cap into a single "Other" bucket. Returns the kept
 * categories (original order preserved) plus the collapsed total + count, so
 * the bar never degrades into unreadable slivers. Below the cap it is a no-op.
 */
export function collapseToOther(
  items: ReadonlyArray<SegmentedBarItem>,
  maxSegments: number,
): CollapsedSegments {
  if (items.length <= maxSegments) {
    return { visible: [...items], other: null };
  }

  const kept = new Set(
    [...items]
      .sort((a, b) => b.value - a.value)
      .slice(0, Math.max(0, maxSegments - 1)),
  );

  const collapsed = items.filter((item) => !kept.has(item));

  return {
    visible: items.filter((item) => kept.has(item)),
    other: {
      value: sum(collapsed.map((item) => item.value)),
      count: collapsed.length,
    },
  };
}
