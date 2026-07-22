import type { SelectOption } from './SelectOption.ts';

export type SegmentedSelectOption = SelectOption & {
  /**
   * When set, the segment renders as a link and navigates (SPA, `replaceState`)
   * on activation instead of only firing `onChange` - used for URL-param driven
   * selects like the discover toggle. Active global parameters are merged into
   * the href automatically, matching the legacy `Toggler` link behaviour.
   */
  href?: string;
};
