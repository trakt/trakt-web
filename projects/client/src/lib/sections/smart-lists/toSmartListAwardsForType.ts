import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import type { AwardCeremony } from '$lib/requests/models/AwardCeremony.ts';

type SmartListAwardsForTypeProps = {
  catalog: ReadonlyArray<AwardCeremony>;
  type: DiscoverMode;
};

export function toSmartListAwardsForType({
  catalog,
  type,
}: SmartListAwardsForTypeProps): ReadonlyArray<AwardCeremony> {
  if (type === 'media') return catalog;

  return catalog.filter((ceremony) => ceremony.mediaTypes.includes(type));
}
