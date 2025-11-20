type GetMaxItemCountProps = {
  container: HTMLElement;
  itemWidth: number;
  gap: number;
};

const MIN_ITEM_COUNT = 1;

export function getMaxItemCount(
  { container, itemWidth, gap }: GetMaxItemCountProps,
) {
  const computedWidth = getComputedStyle(container).width;
  const width = Number(computedWidth.replace('px', ''));

  const limitedItems = Math.floor(
    (width + gap) / (itemWidth + gap),
  );

  // -1 to reserve space for the action card
  return Math.max(limitedItems - 1, MIN_ITEM_COUNT);
}
