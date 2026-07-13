import type { Snippet } from 'svelte';

export type AllTimeStatRowProps = {
  icon: Snippet;
  label: string;
  value: string;
  isLoading: boolean;
  /** VIP-gated rows render a lock indicator instead of the value for free users. */
  locked?: boolean;
};
