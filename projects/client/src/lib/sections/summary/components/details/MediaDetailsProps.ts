import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaStudio } from '$lib/requests/models/MediaStudio.ts';

export type MediaDetailsProps = {
  media: MediaEntry;
  studios: MediaStudio[];
  crew: MediaCrew;
};
