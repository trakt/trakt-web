import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaStudio } from '$lib/requests/models/MediaStudio.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

type EpisodeProps = {
  type: 'episode';
  episode: EpisodeEntry;
};

type MediaProps = {
  type: MediaType;
  media: MediaEntry;
  studios: MediaStudio[];
};

export type MediaDetailsProps = {
  crew: MediaCrew;
} & (EpisodeProps | MediaProps);
