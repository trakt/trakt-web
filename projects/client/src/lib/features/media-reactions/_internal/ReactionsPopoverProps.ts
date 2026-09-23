import type { ReactionDistribution } from '$lib/requests/models/ReactionDistribution.ts';
import type { Reaction } from '$lib/requests/queries/comments/commentReactionsQuery.ts';
import type { Snippet } from 'svelte';

export type ReactionsPopoverProps = {
  chosen: Reaction | null;
  /** Fires with the tapped reaction; the caller decides set vs. clear. */
  onSelect: (reaction: Reaction) => void;
  /** Counts behind the ranking panel. */
  distribution: ReactionDistribution;
  /** What the viewer clicks - the badge on the summary header. */
  trigger: Snippet;
};
