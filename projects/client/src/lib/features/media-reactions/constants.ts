import type { MediaReaction } from '$lib/requests/models/MediaReaction.ts';

export const MAX_MEDIA_REACTIONS = 3;

export const QUICK_MEDIA_REACTIONS: ReadonlyArray<MediaReaction> = [
  'heart_eyes',
  'rofl',
  'holding_back_tears',
  'mind_blown',
  'shocked',
  'yawning',
];
