type ResampleSeriesProps = {
  values: ReadonlyArray<number>;
  targetLength: number;
};

/**
 * Resample a series to `targetLength` points using monotone cubic Hermite
 * interpolation (Fritsch-Carlson tangents). Keeping the curve monotone between
 * samples avoids the overshoot a naive cubic adds, so a `<path>` re-sampled to
 * a new length keeps its bezier roundness and morphs cleanly under
 * `transition: d` instead of snapping.
 *
 * Fritsch, F. N.; Carlson, R. E. (1980), "Monotone Piecewise Cubic
 * Interpolation", SIAM Journal on Numerical Analysis.
 */
export function resampleSeries(
  { values, targetLength }: ResampleSeriesProps,
): number[] {
  const length = values.length;

  if (targetLength <= 0 || length === 0) {
    return [];
  }

  if (length === 1) {
    return new Array(targetLength).fill(values[0]);
  }

  if (targetLength === 1) {
    return [values[0] ?? 0];
  }

  const tangents = monotoneTangents(values);

  return Array.from({ length: targetLength }, (_, index) => {
    const position = (index * (length - 1)) / (targetLength - 1);
    const left = Math.min(Math.floor(position), length - 2);
    const t = position - left;

    return hermite({
      t,
      from: values[left] ?? 0,
      to: values[left + 1] ?? 0,
      tangentFrom: tangents[left] ?? 0,
      tangentTo: tangents[left + 1] ?? 0,
    });
  });
}

/** Slopes between adjacent samples (unit x-spacing). */
function secantSlopes(values: ReadonlyArray<number>): number[] {
  return values.slice(0, -1).map((value, index) => values[index + 1] - value);
}

/** Per-point tangents constrained so the interpolant stays monotone. */
function monotoneTangents(values: ReadonlyArray<number>): number[] {
  const slopes = secantSlopes(values);
  const last = values.length - 1;

  const tangents = values.map((_, index) => {
    if (index === 0) {
      return slopes[0];
    }
    if (index === last) {
      return slopes[last - 1];
    }
    return (slopes[index - 1] + slopes[index]) / 2;
  });

  slopes.forEach((slope, index) => {
    if (slope === 0) {
      tangents[index] = 0;
      tangents[index + 1] = 0;
      return;
    }

    const alpha = tangents[index] / slope;
    const beta = tangents[index + 1] / slope;
    const magnitude = alpha * alpha + beta * beta;

    if (magnitude <= 9) {
      return;
    }

    const scale = 3 / Math.sqrt(magnitude);
    tangents[index] = scale * alpha * slope;
    tangents[index + 1] = scale * beta * slope;
  });

  return tangents;
}

type HermiteProps = {
  t: number;
  from: number;
  to: number;
  tangentFrom: number;
  tangentTo: number;
};

/** Cubic Hermite basis evaluation on a unit interval. */
function hermite(
  { t, from, to, tangentFrom, tangentTo }: HermiteProps,
): number {
  const t2 = t * t;
  const t3 = t2 * t;

  return (2 * t3 - 3 * t2 + 1) * from +
    (t3 - 2 * t2 + t) * tangentFrom +
    (-2 * t3 + 3 * t2) * to +
    (t3 - t2) * tangentTo;
}
