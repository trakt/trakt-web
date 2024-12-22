import type { Genre } from '$lib/api.ts';

type ImageUrls = {
  medium: string;
  thumb: string;
};

export type MediaSummary = {
  id: number;
  slug: string;
  year: number | Nil;
  runtime: number;
  title: string;
  tagline: string;
  country: string | Nil;
  languages: string[] | Nil;
  poster: {
    url: ImageUrls;
  };
  cover: {
    url: ImageUrls;
  };
  thumb: {
    url: string;
  };
  genres: Genre[];
  overview: string;
  trailer: string;
  airedDate: Date;
  certification?: string;
};
