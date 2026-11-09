import type { FilterParam } from '../models/FilterParams.ts';
import type { PaginationParams } from '../models/PaginationParams.ts';

type RecommendedProps = PaginationParams & {
  filterParams: DeepPartial<FilterParam> | undefined;
};

export function getRecommendedSearchParams({
  limit,
  page,
  filterParams,
}: RecommendedProps) {
  const params = {
    extended: 'full,colors',
    ignore_collected: true,
    limit,
    page,
    ...filterParams,
    // FIXME: remove when we have tri-state filter toggles
    ignore_watched: true,
  };

  const definedParams = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [key, String(value)]);

  return new URLSearchParams(definedParams);
}
