export type SegmentBounds = {
  left: number;
  width: number;
};

type ToReorderIndexProps = {
  segments: ReadonlyArray<SegmentBounds>;
  pointerX: number;
};

/**
 * Which slot the pointer is currently over, by comparing against each
 * segment's midpoint. Past the last midpoint the answer is the end of the row,
 * so dragging a chip off either edge parks it there rather than doing nothing.
 */
export function toReorderIndex(
  { segments, pointerX }: ToReorderIndexProps,
): number {
  if (segments.length === 0) {
    return 0;
  }

  const crossed = segments.findIndex(
    (segment) => pointerX < segment.left + segment.width / 2,
  );

  return crossed === -1 ? segments.length - 1 : crossed;
}
