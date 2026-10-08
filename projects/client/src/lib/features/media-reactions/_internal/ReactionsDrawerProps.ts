import type { MediaReaction } from '$lib/requests/models/MediaReaction.ts';

export type ReactionsDrawerProps = {
  chosen: ReadonlyArray<MediaReaction>;
  onSelect: (reaction: MediaReaction) => void;
  onClose: () => void;
};
