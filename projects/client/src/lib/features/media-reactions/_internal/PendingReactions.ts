import type { MediaReaction } from '$lib/requests/models/MediaReaction.ts';
import type { PendingReaction } from './PendingReaction.ts';

export type PendingReactions = Readonly<
  Partial<Record<MediaReaction, PendingReaction>>
>;
