import type { ReactionSentiment } from '$lib/requests/models/ReactionSentiment.ts';

export type ReactionChipProps = {
  sentiment: ReactionSentiment;
  count: number;
  // Highlights the chip the user is currently viewing / has picked.
  selected: boolean;
  onclick: () => void;
};
