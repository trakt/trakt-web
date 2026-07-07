import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Season } from '$lib/requests/models/Season.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

type RateableEpisode = {
  type: 'episode';
  media: EpisodeEntry;
  show: ShowEntry;
};

type RateableSeason = {
  type: 'season';
  media: Season;
  show: ShowEntry;
};

type RateableMedia = {
  type: MediaType;
  media: MediaEntry;
};

export type RateNowProps =
  & (RateableEpisode | RateableSeason | RateableMedia)
  & {
    onclick?: () => void;
    style?: 'default' | 'minimal';
  };
