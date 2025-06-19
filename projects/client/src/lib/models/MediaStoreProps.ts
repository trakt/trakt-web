type ArrayOrSingle<T> = T | T[];

type EpisodeProps<T> = {
  type: 'episode';
  media: ArrayOrSingle<T & { season: number; number: number }>;
  show: { id: number };
};

type MediaProps<T> = {
  type: 'movie' | 'show';
  media: ArrayOrSingle<T>;
};

export type MediaStoreProps<T extends { id: number } = { id: number }> =
  | EpisodeProps<T>
  | MediaProps<T>;
