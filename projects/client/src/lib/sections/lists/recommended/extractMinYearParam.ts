import { RECOMMENDED_DEFAULT_MIN_YEAR } from '$lib/utils/constants.ts';

export function extractMinYearParam(params: URLSearchParams) {
  return {
    min_year: parseInt(
      params.get('min_year') ?? RECOMMENDED_DEFAULT_MIN_YEAR.toString(),
      10,
    ),
  };
}
