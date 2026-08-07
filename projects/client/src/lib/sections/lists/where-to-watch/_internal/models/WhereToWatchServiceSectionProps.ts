import type { ServiceInCountry } from './ServiceInCountry.ts';
import type { StreamingGroup } from './StreamingGroup.ts';

export type WhereToWatchServiceSectionProps = {
  readonly source: string;
  readonly countries: ReadonlyArray<ServiceInCountry>;
  readonly group: StreamingGroup;
  /**
   * When true, the section forces itself open to reveal search matches; when it
   * flips back to false the section collapses to its default state.
   */
  readonly isSearching?: boolean;
};
