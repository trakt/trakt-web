import type { Genre } from '$lib/api.ts';

export type MediaSummary = {
  id: number;
  slug: string;
  runtime: number;
  title: string;
  tagline: string;
  poster: {
    url: string;
  };
  cover: {
    url: string;
  };
  thumb: {
    url: string;
  };
  genres: Genre[];
  overview: string;
  trailer?: string;
};
