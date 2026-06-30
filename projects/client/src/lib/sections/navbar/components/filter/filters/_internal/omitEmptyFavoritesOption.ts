import type { FilterOption } from '$lib/features/filters/models/FilterOptions.ts';

const favoritesOptionValue = 'favorites';

export function omitEmptyFavoritesOption(
  options: ReadonlyArray<FilterOption>,
  hasFavorites: boolean,
): ReadonlyArray<FilterOption> {
  if (hasFavorites) {
    return options;
  }

  return options.filter((option) => option.value !== favoritesOptionValue);
}
