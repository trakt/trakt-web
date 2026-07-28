import type { AnalyticsData } from '../AnalyticsData.ts';

// Keys HAL stores as queryable numbers. Everything else lands in a string blob,
// where `avg()` no longer works on it. A metric key absent from HAL's own
// allowlist has no storage slot and is dropped server-side, so extend this only
// alongside the worker.
const METRIC_KEYS: ReadonlySet<string> = new Set([
  'ambiguousCount',
  'duration',
  'endpointCount',
  'failedCount',
  'historyCount',
  'rating',
  'ratingsCount',
  'successCount',
  'totalItems',
  'unresolvedCount',
  'watchlistCount',
]);

function isMetric(entry: [string, string | number]): entry is [string, number] {
  const [key, value] = entry;
  return METRIC_KEYS.has(key) && typeof value === 'number' &&
    Number.isFinite(value);
}

export function splitEventPayload(data: AnalyticsData) {
  const entries = Object.entries(data);

  return {
    dims: Object.fromEntries(
      entries
        .filter((entry) => !isMetric(entry))
        .map(([key, value]) => [key, String(value)]),
    ),
    metrics: Object.fromEntries(entries.filter(isMetric)),
  };
}
