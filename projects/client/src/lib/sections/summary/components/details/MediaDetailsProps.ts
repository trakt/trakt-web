import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaStudio } from '$lib/requests/models/MediaStudio.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type MediaDetailsProps = {
  type: MediaType;
  media: MediaEntry;
  studios: MediaStudio[];
  crew: MediaCrew;
};
