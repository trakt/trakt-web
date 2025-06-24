// Obtained by trial an error on small progress bars
const STRETCH_FACTOR = 4;

type StretchedPercentageProps = {
  value: number;
  total: number;
};

/*
 * Applies a sigmoid like transformation to emphasize small values
 * and de-emphasize large values.
 */
export function stretchedPercentage(
  { value, total }: StretchedPercentageProps,
): number {
  const progress = value / total;
  if (progress === 0 || progress === 1) {
    return progress * 100;
  }

  const exponent = -STRETCH_FACTOR * (progress - 0.5);
  const factor = 1 / (1 + Math.exp(exponent));

  return factor * 100;
}
