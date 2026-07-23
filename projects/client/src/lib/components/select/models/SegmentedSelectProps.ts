import type { Snippet } from 'svelte';
import type { SegmentedSelectOption } from './SegmentedSelectOption.ts';
import type { SelectOption } from './SelectOption.ts';
import type { SelectVariant } from './SelectVariant.ts';

export type SegmentedSelectProps = {
  options: ReadonlyArray<SegmentedSelectOption>;
  value: string;
  variant?: SelectVariant;
  disabled?: boolean;
  /** Accessible name for the radio group (optional - each segment is named too). */
  ariaLabel?: string;
  /** Optional per-option icon; required visual for the compact (icon-only) variant. */
  icon?: Snippet<[SelectOption]>;
  /**
   * Opt into the animated expandable layout: a flex track with a JS-measured
   * sliding selector, where the trailing `collapsedCount` options fold away
   * until `expanded`. Leaving this unset keeps the default equal-column grid +
   * pure-CSS selector (SSR-correct, zero measurement) exactly as-is.
   */
  expandable?: boolean;
  /** Number of TRAILING options kept collapsed until `expanded`. Expandable only. */
  collapsedCount?: number;
  /** Reveal the collapsed trailing options with the unfold animation. Expandable only. */
  expanded?: boolean;
  /**
   * Optional second row rendered inside the track below the options while
   * `expanded` (e.g. an embedded search field), revealed with a slide.
   * Expandable only.
   */
  extension?: Snippet;
  onChange: (value: string) => void;
};
