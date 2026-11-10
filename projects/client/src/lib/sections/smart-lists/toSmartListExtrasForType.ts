import { EXCLUSION_PREFIX } from '$lib/features/filters/exclusionPrefix.ts';
import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import type { AwardCeremony } from '$lib/requests/models/AwardCeremony.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { SmartListFilters } from '$lib/requests/models/SmartListFilters.ts';
import { SHOW_ONLY_SMART_LIST_FILTERS } from './showOnlySmartListFilters.ts';
import { withSmartListAwards } from './withSmartListAwards.ts';

type SmartListExtrasForTypeProps = {
  filters: SmartListFilters;
  type: DiscoverMode;
  catalog?: ReadonlyArray<AwardCeremony>;
};

const withoutShowOnly = (filters: SmartListFilters): SmartListFilters =>
  Object.fromEntries(
    Object.entries(filters).filter(
      ([key]) =>
        !SHOW_ONLY_SMART_LIST_FILTERS.includes(key as keyof SmartListFilters),
    ),
  );

const fitsType =
  (catalog: ReadonlyArray<AwardCeremony>, type: MediaType) => (raw: string) => {
    const slug = raw.startsWith(EXCLUSION_PREFIX)
      ? raw.slice(EXCLUSION_PREFIX.length)
      : raw;
    const ceremony = catalog.find(({ awards }) =>
      awards.some((award) => award.slug === slug),
    );

    return !ceremony || ceremony.mediaTypes.includes(type);
  };

const withAwardsFor = ({
  filters,
  catalog,
  type,
}: {
  filters: SmartListFilters;
  catalog: ReadonlyArray<AwardCeremony>;
  type: MediaType;
}): SmartListFilters =>
  withSmartListAwards({
    filters,
    awards: (filters.awards ?? []).filter(fitsType(catalog, type)),
  });

export function toSmartListExtrasForType({
  filters,
  type,
  catalog = [],
}: SmartListExtrasForTypeProps): SmartListFilters {
  if (type === 'media') return filters;
  if (type === 'show') return withAwardsFor({ filters, catalog, type });

  return withAwardsFor({ filters: withoutShowOnly(filters), catalog, type });
}
