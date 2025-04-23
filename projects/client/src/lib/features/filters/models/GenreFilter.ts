import type { Genre } from '@trakt/api';

type GenreOption = {
  label: string;
  value: Genre;
};

export type GenreFilter = {
  key: 'genres';
  options: Array<GenreOption>;
};
