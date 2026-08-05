import type { ServiceInCountry } from './ServiceInCountry.ts';
import type { StreamingGroup } from './StreamingGroup.ts';

export type WhereToWatchServiceSectionProps = {
  readonly source: string;
  readonly countries: ReadonlyArray<ServiceInCountry>;
  readonly group: StreamingGroup;
  readonly userCountry: string;
  readonly isSearching?: boolean;
};
