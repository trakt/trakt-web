import type { MediaType } from '$lib/models/MediaType.ts';

export type ListItem<TMediaItem> = {
  id: number;
  rank: number;
  notes: string | Nil;
  listedAt: Date;
  type: MediaType;
  mediaItem: TMediaItem;
};
