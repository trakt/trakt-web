import type { EpisodeType } from './EpisodeType.ts';

export type EpisodeEntry = {
  id: number;
  season: number;
  number: number;
  title: string;
  overview: string;
  cover: {
    url: string | Nil;
  };
  genres: [];
  airedDate: Date;
  type: EpisodeType;
  runtime: number;
  year: number;
  certification?: null;
};
