type ComputeRangeSelectionProps = {
  order: ReadonlyArray<string>;
  anchorKey: string | Nil;
  targetKey: string;
};

/**
 * Resolves a shift-click range: every key between the anchor and the target
 * (inclusive) in rendered order. Falls back to just the target when there is
 * no anchor yet, or either key has scrolled out of the registered order.
 */
export function computeRangeSelection(
  { order, anchorKey, targetKey }: ComputeRangeSelectionProps,
): string[] {
  const anchorIndex = anchorKey == null ? -1 : order.indexOf(anchorKey);
  const targetIndex = order.indexOf(targetKey);

  if (anchorIndex === -1 || targetIndex === -1) {
    return [targetKey];
  }

  const [start, end] = anchorIndex <= targetIndex
    ? [anchorIndex, targetIndex]
    : [targetIndex, anchorIndex];

  return order.slice(start, end + 1);
}
