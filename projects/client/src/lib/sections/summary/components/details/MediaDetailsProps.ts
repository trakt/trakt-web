import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaNetwork } from '$lib/requests/models/MediaNetwork.ts';
import type { MediaStudio } from '$lib/requests/models/MediaStudio.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

type EpisodeProps = {
  type: 'episode';
  episode: EpisodeEntry;
  show: ShowEntry;
};

type ShowProps = {
  type: 'show';
  media: ShowEntry;
  studios: MediaStudio[];
};

type MovieProps = {
  type: 'movie';
  media: MediaEntry;
  studios: MediaStudio[];
};

export type MediaDetailsProps = {
  crew: MediaCrew;
  networks?: MediaNetwork[];
} & (EpisodeProps | ShowProps | MovieProps);
