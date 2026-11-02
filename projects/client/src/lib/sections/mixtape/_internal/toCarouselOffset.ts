type CarouselOffsetParams = {
  index: number;
  selected: number;
  count: number;
};

/*
  Where a card sits relative to the selected one, wrapping round the ends so
  the cards either side of the selection are always its neighbours.
*/
export function toCarouselOffset({
  index,
  selected,
  count,
}: CarouselOffsetParams): number {
  if (count === 0) return 0;

  const offset = index - selected;
  const half = Math.floor(count / 2);

  if (offset > half) return offset - count;
  if (offset < -half) return offset + count;
  return offset;
}
