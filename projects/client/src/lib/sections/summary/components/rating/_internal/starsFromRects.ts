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

  // Past the leading edge clears the rating (0 stars); the trailing edge is
  // the max. 0 is only reachable here - within the stars the fraction floors
  // at a half (or whole) star.
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

  const fraction = isRtl
    ? (rect.right - clientX) / rect.width
    : (clientX - rect.left) / rect.width;
  const whole = hitIndex + 1;
  const isFirstStar = hitIndex === 0;

  if (!allowHalf) {
    // The first star clears to 0 on its leading half; the rest stay whole.
    if (isFirstStar && fraction < 0.5) return 0;
    return whole;
  }

  // The first star is split three ways so its leading region can clear the
  // rating (0 | 0.5 | 1) without having to reach past the row's edge. Every
  // other star keeps the standard near-half / far-whole split.
  if (isFirstStar) {
    if (fraction < 1 / 3) return 0;
    if (fraction < 2 / 3) return 0.5;
    return 1;
  }

  return fraction < 0.5 ? whole - 0.5 : whole;
}
