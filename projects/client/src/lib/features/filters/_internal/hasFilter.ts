import { FILTERS } from './constants.ts';

export function hasFilter(
  params: URLSearchParams | Array<[string, string]>,
): boolean {
  const arr = params instanceof URLSearchParams
    ? Array.from(params.entries())
    : params;

  return arr.some(([key]) => FILTERS.some((filter) => filter.key === key));
}
