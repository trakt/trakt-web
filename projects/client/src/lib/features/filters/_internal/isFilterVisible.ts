import type { DiscoverMode } from '../models/DiscoverMode.ts';
import type { FilterSurface } from '../models/FilterSurface.ts';

type FilterVisibility = {
  surfaces?: ReadonlyArray<FilterSurface>;
  modes?: ReadonlyArray<DiscoverMode>;
};

type IsFilterVisibleProps = {
  filter: FilterVisibility;
  surface: FilterSurface | undefined;
  mode: DiscoverMode;
};

/**
 * Whether a filter belongs in the panel as it is currently being rendered. A
 * filter that declares neither surfaces nor modes is global and always shows;
 * declaring either narrows it to the pages, or the media types, it can act on.
 */
export function isFilterVisible(
  { filter, surface, mode }: IsFilterVisibleProps,
): boolean {
  const isOnSurface = !filter.surfaces ||
    (surface != null && filter.surfaces.includes(surface));
  const isInMode = !filter.modes || filter.modes.includes(mode);

  return isOnSurface && isInMode;
}
