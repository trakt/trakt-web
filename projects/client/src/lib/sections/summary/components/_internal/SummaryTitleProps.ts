import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import type { MediaSummaryEntry } from '../media/models/MediaSummaryEntry.ts';

export type EpisodeSummaryEntry = {
  type: 'episode';
  media: ShowEntry;
  episode: EpisodeEntry;
};

export type SummaryTitleProps = {
  title: string;
  status?: MediaStatus | Nil;
  crew: MediaCrew;
} & (EpisodeSummaryEntry | MediaSummaryEntry);
