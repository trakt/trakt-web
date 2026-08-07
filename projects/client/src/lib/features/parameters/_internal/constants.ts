import { FILTER_KEYS } from '$lib/features/filters/filterKeys.ts';

const STORE_BACKED_PARAMS: readonly string[] = ['mode'];

export const WHITE_LISTED_PARAMS: readonly string[] = [
  'navigation',
  ...STORE_BACKED_PARAMS,
  ...FILTER_KEYS,
];

export const OUTBOUND_PARAMS: readonly string[] = WHITE_LISTED_PARAMS
  .filter((key) => !STORE_BACKED_PARAMS.includes(key));

export const LOCAL_PARAMS: readonly string[] = ['sort_by', 'sort_how'];
