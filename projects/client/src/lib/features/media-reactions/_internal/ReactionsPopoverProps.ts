import type { MediaReaction } from '$lib/requests/models/MediaReaction.ts';
import type { ReactionDistribution } from '$lib/requests/models/ReactionDistribution.ts';
import type { Snippet } from 'svelte';

export type ReactionsPopoverProps = {
  chosen: ReadonlyArray<MediaReaction>;
  onSelect: (reaction: MediaReaction) => void;
  distribution: Partial<ReactionDistribution<MediaReaction>>;
  isLoading: boolean;
  trigger: Snippet;
  onOpenChange?: (isOpen: boolean) => void;
};
