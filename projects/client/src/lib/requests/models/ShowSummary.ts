import type { Genre } from '$lib/api.ts';

export type ShowSummary = {
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
  genres: Genre[];
  overview: string;
  trailer?: string;
};
