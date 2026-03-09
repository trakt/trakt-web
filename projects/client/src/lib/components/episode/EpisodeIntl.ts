import { type EpisodeType } from '$lib/requests/models/EpisodeType.ts';

type TimestampMetaData = {
  date: Date;
  type: EpisodeType;
};

export type EpisodeIntl = {
  premiereText: () => string;
  finaleText: () => string;
  timestampText: (metadata: TimestampMetaData) => string;
  durationText: (duration: number) => string;
  remainingText: (remaining: number) => string;
};
