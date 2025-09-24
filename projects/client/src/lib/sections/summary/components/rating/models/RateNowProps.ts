import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

type RateableEpisode = {
  type: 'episode';
  media: EpisodeEntry;
  show: ShowEntry;
};

type RateableMedia = {
  type: MediaType;
  media: MediaEntry;
};

export type RateNowProps = RateableEpisode | RateableMedia;
