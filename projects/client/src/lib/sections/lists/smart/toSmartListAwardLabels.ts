import type { AwardCeremony } from '$lib/requests/models/AwardCeremony.ts';
import { withShortAwardNames } from '$lib/sections/smart-lists/withShortAwardNames.ts';
import type { SmartListAwardLabel } from './models/SmartListAwardLabel.ts';

export function toSmartListAwardLabels(
  catalog: ReadonlyArray<AwardCeremony>,
): ReadonlyMap<string, SmartListAwardLabel> {
  return new Map(
    catalog.flatMap((ceremony) => {
      const short = withShortAwardNames(ceremony);

      return ceremony.awards.map((award, index) => [
        award.slug,
        {
          ceremonySlug: ceremony.slug,
          ceremony: ceremony.name,
          name: award.name,
          shortName: short.awards.at(index)?.name ?? award.name,
        },
      ]);
    }),
  );
}
