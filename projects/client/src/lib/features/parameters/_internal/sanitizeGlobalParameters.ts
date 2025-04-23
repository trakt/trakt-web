import { WHITE_LISTED_PARAMS } from '$lib/features/parameters/_internal/constants.ts';

export function sanitizeGlobalParameters(params: URLSearchParams) {
  return Object.fromEntries(
    Array
      .from(params.entries())
      .filter(([key]) => WHITE_LISTED_PARAMS.includes(key)),
  );
}
