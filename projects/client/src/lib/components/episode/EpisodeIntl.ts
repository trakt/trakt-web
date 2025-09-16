import {
  EpisodeFinaleType,
  EpisodePremiereType,
  type EpisodeType,
} from '$lib/requests/models/EpisodeType.ts';

export type PremiereMetadata = {
  type: EpisodePremiereType;
};

export type FinaleMetadata = {
  type: EpisodeFinaleType;
};

type TimestampMetaData = {
  date: Date;
  type: EpisodeType;
};

export type EpisodeIntl = {
  premiereText: (metadata: PremiereMetadata) => string;
  finaleText: (metadata: FinaleMetadata) => string;
  timestampText: (metadata: TimestampMetaData) => string;
  durationText: (duration: number) => string;
  remainingText: (remaining: number) => string;
  fullSeasonText: () => string;
};
