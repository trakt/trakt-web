import type { ReactionSentiment } from '$lib/requests/models/ReactionSentiment.ts';
import type { Snippet } from 'svelte';

export type ReactionsPopoverProps = {
  chosen: ReactionSentiment | null;
  /** Fires with the tapped sentiment; the caller decides set vs. clear. */
  onSelect: (sentiment: ReactionSentiment) => void;
  /** What the viewer clicks - the badge on the summary header. */
  trigger: Snippet;
};
