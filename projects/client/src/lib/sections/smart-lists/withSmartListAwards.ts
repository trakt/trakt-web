import type { SmartListFilters } from '$lib/requests/models/SmartListFilters.ts';

type WithSmartListAwardsProps = {
  filters: SmartListFilters;
  awards: ReadonlyArray<string>;
};

export function withSmartListAwards({
  filters,
  awards,
}: WithSmartListAwardsProps): SmartListFilters {
  const {
    awards: _awards,
    award_years: _years,
    award_won: _won,
    ...rest
  } = filters;

  if (awards.length === 0) return rest;

  return { ...filters, awards: [...awards] };
}
