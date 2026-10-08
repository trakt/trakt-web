import type { MediaReaction } from '$lib/requests/models/MediaReaction.ts';

export type ReactionsSnapshot = {
  held: ReadonlyArray<MediaReaction>;
  distribution: Readonly<Partial<Record<MediaReaction, number>>>;
  totalCount: number;
};
