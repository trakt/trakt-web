import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type GameTitle = {
  key: string;
  title: string;
  type: MediaType;
  year: number | Nil;
  rating: number;
  poster: string;
};
