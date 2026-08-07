import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import type { MediaIntl } from '$lib/requests/models/MediaIntl.ts';
import type { SentimentAnalysis } from '$lib/requests/models/SentimentAnalysis.ts';
import type { StreamOn } from '$lib/requests/models/StreamOn.ts';
import type { MediaSummaryEntry } from '../models/MediaSummaryEntry.ts';

/**
 * Shared by both revamped header directions, so a page can swap one for the
 * other without touching its own wiring.
 */
export type SummaryHeaderProps = {
  intl: MediaIntl;
  crew: MediaCrew;
  streamOn?: StreamOn;
  sentiment?: SentimentAnalysis | Nil;
} & MediaSummaryEntry;
