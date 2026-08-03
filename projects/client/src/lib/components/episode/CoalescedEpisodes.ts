import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';

export type CoalescedEpisodes =
  | ReadonlyArray<Pick<EpisodeEntry, 'type'>>
  | Nil;
