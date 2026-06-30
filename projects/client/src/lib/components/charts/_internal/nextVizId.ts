let counter = 0;

/**
 * Stable, incrementing id for chart `<defs>` (gradient/pattern/filter) so the
 * `url(#...)` references resolve uniquely per instance. Unlike
 * `crypto.randomUUID()` this never throws in non-secure contexts (HTTP) and is
 * deterministic, and the def id + its reference are derived from the same value
 * so they always match within a render.
 */
export function nextVizId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}
