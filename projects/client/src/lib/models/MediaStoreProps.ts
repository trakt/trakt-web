type ArrayOrSingle<T> = T | T[];
type SeasonInfo = {
  seasons: Array<{
    number: number;
    episodes: Array<{
      number: number;
    }>;
  }>;
};

type EpisodeProps<T> = {
  type: 'episode';
  media: ArrayOrSingle<T & { season: number; number: number }>;
  show: { id: number; title: string };
};

type MovieProps<T> = {
  type: 'movie';
  media: ArrayOrSingle<T>;
};

type ShowProps<T> = {
  type: 'show';
  media: ArrayOrSingle<T & Partial<SeasonInfo>>;
};

export type MediaStoreProps<T extends { id: number } = { id: number }> =
  | EpisodeProps<T>
  | ShowProps<T>
  | MovieProps<T>;
