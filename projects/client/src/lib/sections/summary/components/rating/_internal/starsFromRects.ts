type Rect = Pick<DOMRect, 'left' | 'right' | 'width'>;

type StarsFromRectsParams = {
  rects: ReadonlyArray<Rect>;
  clientX: number;
  allowHalf: boolean;
  isRtl: boolean;
  max: number;
};

// Maps a pointer's clientX onto a star rating, given the measured star rects.
// Mirrors bits-ui's own pointer math: the inline axis runs right-to-left in
// RTL, and half precision is decided by which half of a star the pointer is
// over. The active star is the one whose center is nearest the pointer, so a
// pointer in the gap between two stars still resolves cleanly. Pure (rects are
// measured by the caller) so it can be unit-tested.
export function starsFromRects(
  { rects, clientX, allowHalf, isRtl, max }: StarsFromRectsParams,
): number | null {
  if (rects.length === 0) return null;

  const inlineStart = Math.min(...rects.map((rect) => rect.left));
  const inlineEnd = Math.max(...rects.map((rect) => rect.right));

  if (clientX <= inlineStart) return isRtl ? max : 0;
  if (clientX >= inlineEnd) return isRtl ? 0 : max;

  const hitIndex = rects
    .map((rect, index) => ({
      index,
      distance: Math.abs(clientX - (rect.left + rect.width / 2)),
    }))
    .reduce((best, current) =>
      current.distance < best.distance ? current : best
    )
    .index;

  const rect = rects.at(hitIndex);
  if (!rect) return null;

  const whole = hitIndex + 1;
  if (!allowHalf) return whole;

  const fraction = isRtl
    ? (rect.right - clientX) / rect.width
    : (clientX - rect.left) / rect.width;

  return fraction < 0.5 ? whole - 0.5 : whole;
}
