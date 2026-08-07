import { FILTER_KEYS } from '$lib/features/filters/filterKeys.ts';

const STORE_BACKED_PARAMS: readonly string[] = ['mode'];

export const OUTBOUND_PARAMS: readonly string[] = [
  'navigation',
  ...FILTER_KEYS,
];

export const WHITE_LISTED_PARAMS: readonly string[] = [
  ...OUTBOUND_PARAMS,
  ...STORE_BACKED_PARAMS,
];

export const LOCAL_PARAMS: readonly string[] = ['sort_by', 'sort_how'];
