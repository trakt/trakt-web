import type { ReactionSentiment } from '$lib/requests/models/ReactionSentiment.ts';

export type ReactionsCtaProps = {
  // Preview reactions shown before the user has picked one (top 3 for the
  // title). Ignored once `chosen` is set.
  topSentiments: ReactionSentiment[];
  chosen: ReactionSentiment | null;
  onclick: () => void;
};
