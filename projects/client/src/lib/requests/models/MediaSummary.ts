import type { Genre } from '$lib/api.ts';
import type { MediaType } from '$lib/models/MediaType';
import type { MediaStatus } from './MediaStatus';

type ImageUrls = {
  medium: HttpsUrl;
  thumb: HttpsUrl;
};

export type MediaSummary = {
  id: number;
  slug: string;
  type: MediaType;
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
  status: MediaStatus;
  overview: string;
  trailer: string;
  airDate: Date;
  certification?: string;
};
