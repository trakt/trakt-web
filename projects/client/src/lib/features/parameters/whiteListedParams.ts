import { FILTER_KEYS } from '$lib/features/filters/filterKeys.ts';

export const WHITE_LISTED_PARAMS: readonly string[] = [
  'navigation',
  'mode',
  ...FILTER_KEYS,
];
