import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type MonthReviewTitle = {
  key: string;
  id: number;
  type: MediaType;
  slug: string;
  title: string;
  poster: string;
  cover: string;
  plays: number;
  minutes?: number;
  rating?: number;
};
