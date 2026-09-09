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
 *
 * Segments arrive in option order, which only matches the order on screen while
 * the row reads left to right. Reading the slot off the visual order and
 * mapping it back keeps the answer an option index in either direction.
 */
export function toReorderIndex(
  { segments, pointerX }: ToReorderIndexProps,
): number {
  if (segments.length === 0) {
    return 0;
  }

  const onScreen = segments
    .map((segment, index) => ({ ...segment, index }))
    .sort((left, right) => left.left - right.left);

  const crossed = onScreen.findIndex(
    (segment) => pointerX < segment.left + segment.width / 2,
  );
  const slot = crossed === -1 ? onScreen.length - 1 : crossed;

  return onScreen.at(slot)?.index ?? 0;
}
