type NearestIndexProps = {
  positions: ReadonlyArray<number>;
  target: number;
};

/**
 * Index of the position closest to `target` (used to map a pointer x onto the
 * nearest plotted point). Returns `-1` for an empty set. On ties the lower
 * index wins, keeping scrubbing deterministic.
 */
export function nearestIndex({ positions, target }: NearestIndexProps): number {
  if (positions.length === 0) {
    return -1;
  }

  return positions.reduce((best, position, index) => {
    const closest = positions[best] ?? Infinity;
    return Math.abs(position - target) < Math.abs(closest - target)
      ? index
      : best;
  }, 0);
}
