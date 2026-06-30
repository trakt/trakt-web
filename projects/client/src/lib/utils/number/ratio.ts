type RatioProps = {
  value: number;
  total: number;
};

/**
 * `value / total` guarded against a zero (or absent) total so charts never
 * emit `NaN`/`Infinity` into SVG geometry. A zero total yields `0`.
 */
export function ratio({ value, total }: RatioProps): number {
  if (total === 0) {
    return 0;
  }

  return value / total;
}
