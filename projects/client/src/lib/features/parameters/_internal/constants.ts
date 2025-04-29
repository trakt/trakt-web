import { FilterKey } from '$lib/features/filters/models/Filter.ts';

export const WHITE_LISTED_PARAMS = [
  'navigation',
  ...Object.values(FilterKey),
];
