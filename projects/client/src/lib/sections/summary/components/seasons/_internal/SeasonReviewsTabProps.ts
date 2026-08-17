import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

export type SeasonReviewsTabProps = {
  show: ShowEntry;
  season: number;
  seasonId: number;
  episodeCount: number;
};
