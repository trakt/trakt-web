import { FILTER_KEYS } from '../filterKeys.ts';
import { getDefaultFilters } from './getDefaultFilters.ts';

export function getSnapshotFilters(
  searchParams: URLSearchParams,
): Record<string, string> {
  const urlFilters = FILTER_KEYS.reduce(
    (acc, key) => {
      const value = searchParams.get(key);
      if (value) acc[key] = value;
      return acc;
    },
    {} as Record<string, string>,
  );

  if (Object.keys(urlFilters).length > 0) return urlFilters;

  const defaults = getDefaultFilters();
  if (!defaults) return {};

  return Object.fromEntries(
    Object.entries(defaults)
      .filter(([, value]) => value != null)
      .map(([key, value]) => [key, String(value)]),
  );
}
