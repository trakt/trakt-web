import type { SmartListFilters } from '$lib/requests/queries/users/smartListQuery.ts';

const LIST_KEYS = [
  'genres',
  'subgenres',
  'certifications',
  'languages',
  'countries',
  'statuses',
  'networks',
  'watchnow',
] as const;
type ListKey = (typeof LIST_KEYS)[number];

const RANGE_KEYS = [
  'years',
  'ratings',
  'runtimes',
  'imdb_ratings',
  'rt_meters',
  'rt_user_meters',
] as const;
type RangeKey = (typeof RANGE_KEYS)[number];

const BOOLEAN_KEYS = ['ignore_watched', 'ignore_watchlisted'] as const;
type BooleanKey = (typeof BOOLEAN_KEYS)[number];

const isListKey = (key: string): key is ListKey =>
  (LIST_KEYS as readonly string[]).includes(key);
const isRangeKey = (key: string): key is RangeKey =>
  (RANGE_KEYS as readonly string[]).includes(key);
const isBooleanKey = (key: string): key is BooleanKey =>
  (BOOLEAN_KEYS as readonly string[]).includes(key);

const toList = (value: string): string[] =>
  value.split(',').map((item) => item.trim()).filter(Boolean);

const toRange = (value: string): number[] =>
  value
    .split('-')
    .map(Number)
    .filter((item) => !Number.isNaN(item))
    .slice(0, 2);

export function toSmartListFilters(
  filterMap: Record<string, string>,
): SmartListFilters {
  return Object.entries(filterMap).reduce<SmartListFilters>(
    (filters, [key, value]) => {
      if (!value) {
        return filters;
      }

      if (isListKey(key)) {
        return { ...filters, [key]: toList(value) };
      }

      if (isRangeKey(key)) {
        return { ...filters, [key]: toRange(value) };
      }

      if (isBooleanKey(key)) {
        return { ...filters, [key]: value === 'true' };
      }

      return filters;
    },
    {},
  );
}
