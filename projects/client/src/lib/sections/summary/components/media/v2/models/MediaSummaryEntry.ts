import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

type SummaryMovie = {
  type: 'movie';
  media: MovieEntry;
};

type SummaryShow = {
  type: 'show';
  media: ShowEntry;
};

export type MediaSummaryEntry = SummaryMovie | SummaryShow;
