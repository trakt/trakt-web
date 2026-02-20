import { FilterKey } from '$lib/features/filters/models/Filter.ts';

export const WHITE_LISTED_PARAMS: readonly string[] = [
  'navigation',
  ...Object.values(FilterKey),
];

export const LOCAL_PARAMS: readonly string[] = ['sort_by', 'sort_how'];
