export enum EpisodeFinaleType {
  Series = 'series_finale',
  Season = 'season_finale',
  MidSeason = 'mid_season_finale',
}

export enum EpisodePremiereType {
  Series = 'series_premiere',
  Season = 'season_premiere',
  MidSeason = 'mid_season_premiere',
}

export enum EpisodeUnknownType {
  Unknown = 'unknown',
}

export enum EpisodeStandardType {
  Standard = 'standard',
}

export enum EpisodeComputedType {
  FullSeason = 'full_season',
}

export type EpisodeType =
  | EpisodeFinaleType
  | EpisodePremiereType
  | EpisodeUnknownType
  | EpisodeStandardType
  | EpisodeComputedType;
