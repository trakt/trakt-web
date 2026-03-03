type TickLabelIndicesProps = {
  total: number;
  count: number;
};

export function getTickLabelIndices(
  { total, count }: TickLabelIndicesProps,
): number[] {
  if (count >= total) {
    return Array.from({ length: total }, (_, i) => i);
  }

  return Array.from({ length: count }, (_, i) => {
    return Math.round((i * (total - 1)) / (count - 1));
  });
}
