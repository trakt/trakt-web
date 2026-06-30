import type { Snippet } from 'svelte';

export type KpiTileProps = {
  /** Small caption above the value (e.g. "Daily Average"). */
  label: string;
  /** The headline value content - plain text, or split parts (e.g. 2h 11m). */
  children: Snippet;
  /** Optional trend/delta affordance rendered under the value. */
  delta?: Snippet;
  /** Optional leading icon. */
  icon?: Snippet;
  /** Tooltip shown on the value (passes through to the shared Tooltip). */
  tooltip?: string;
  /** Headline size. Defaults to `normal`. */
  size?: 'normal' | 'large';
  /** Horizontal alignment of the stack. Defaults to `start`. */
  align?: 'start' | 'center';
};
