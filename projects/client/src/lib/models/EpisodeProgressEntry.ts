import type { EpisodeEntry } from './EpisodeEntry.ts';

export type EpisodeProgressEntry = EpisodeEntry & {
  total: number;
  completed: number;
  remaining: number;
  runtime: number;
};
