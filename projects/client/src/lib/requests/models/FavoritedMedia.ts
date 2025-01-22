import type { MediaSummary } from './MediaSummary';

export type FavoritedMedia = {
  favoritedAt: Date;
  id: number;
  item: MediaSummary;
};
