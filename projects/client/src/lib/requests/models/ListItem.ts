import type { MediaType } from './MediaType.ts';

export type ListItem<TMediaItem> = {
  id: number;
  rank: number;
  notes: string | Nil;
  listedAt: Date;
  type: MediaType;
  mediaItem: TMediaItem;
};
