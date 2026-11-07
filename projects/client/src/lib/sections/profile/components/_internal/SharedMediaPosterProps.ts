import type { MatchStripEntry } from './buildMatchStrip.ts';

export type SharedMediaPosterProps = Pick<
  MatchStripEntry,
  'id' | 'type' | 'isFavorite'
>;
