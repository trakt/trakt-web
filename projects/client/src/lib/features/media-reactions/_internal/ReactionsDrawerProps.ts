import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { ReactionSentiment } from '$lib/requests/models/ReactionSentiment.ts';
import type { ReactionSummary } from '$lib/requests/models/ReactionSummary.ts';

export type ReactionsDrawerProps = {
  type: MediaType;
  slug: string;
  title: string;
  summary: ReactionSummary;
  chosen: ReactionSentiment | null;
  onSelect: (sentiment: ReactionSentiment) => void;
  onClose: () => void;
};
