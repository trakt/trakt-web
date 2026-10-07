import type { Genre } from '@trakt/api';

export type GenreCardProps = {
  genre?: Genre;
  isSelected?: boolean;
  disabled?: boolean;
  onclick?: () => void;
};
