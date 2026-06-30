type ClampProps = {
  value: number;
  min: number;
  max: number;
};

/** Constrain `value` to the inclusive `[min, max]` range. */
export function clamp({ value, min, max }: ClampProps): number {
  if (min > max) {
    return clamp({ value, min: max, max: min });
  }

  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}
