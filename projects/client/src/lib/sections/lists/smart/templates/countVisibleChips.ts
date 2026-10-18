type CountVisibleChipsProps = {
  widths: number[];
  available: number;
  gap: number;
  maxRows: number;
  moreWidth: number;
};

function countRows({
  widths,
  available,
  gap,
}: Pick<CountVisibleChipsProps, 'widths' | 'available' | 'gap'>): number {
  const { rows } = widths.reduce(
    ({ rows, used }, width) => {
      const clamped = Math.min(width, available);
      const next = used === 0 ? clamped : used + gap + clamped;

      return next <= available
        ? { rows, used: next }
        : { rows: rows + 1, used: clamped };
    },
    { rows: 1, used: 0 },
  );

  return rows;
}

export function countVisibleChips({
  widths,
  available,
  gap,
  maxRows,
  moreWidth,
}: CountVisibleChipsProps): number {
  const fitsAll = countRows({ widths, available, gap }) <= maxRows;
  if (fitsAll) {
    return widths.length;
  }

  const fitting = Array.from(
    { length: widths.length },
    (_, index) => widths.length - 1 - index,
  ).find(
    (count) =>
      countRows({
        widths: [...widths.slice(0, count), moreWidth],
        available,
        gap,
      }) <= maxRows,
  );

  return fitting ?? 0;
}
