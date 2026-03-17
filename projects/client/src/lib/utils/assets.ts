import { assets } from '$app/paths';
import { shuffle } from '$lib/utils/array/shuffle.ts';
import { assertDefined } from './assert/assertDefined.ts';

export const EPISODE_COVER_PLACEHOLDER =
  `${assets}/placeholders/landscape_placeholder.png` as HttpsUrl;

export const MEDIA_COVER_LARGE_PLACEHOLDER =
  `${assets}/placeholders/purple_placeholder.png` as HttpsUrl;

export const MEDIA_COVER_THUMB_PLACEHOLDER =
  `${assets}/placeholders/landscape_placeholder.png` as HttpsUrl;

export const MEDIA_POSTER_PLACEHOLDER =
  `${assets}/placeholders/portrait_placeholder.png` as HttpsUrl;

export const PLACEHOLDERS: string[] = [
  EPISODE_COVER_PLACEHOLDER,
  MEDIA_COVER_LARGE_PLACEHOLDER,
  MEDIA_COVER_THUMB_PLACEHOLDER,
  MEDIA_POSTER_PLACEHOLDER,
];

const generateShareCover = (type: 'show' | 'movie') =>
  assertDefined(
    shuffle(
      [1, 2, 3, 4, 5].map((n) => `${assets}/trakt_share_${type}_${n}.webp`),
    ).at(0),
    `${type} share cover is required`,
  );

export const DEFAULT_SHARE_SHOW_COVER = generateShareCover('show');
export const DEFAULT_SHARE_MOVIE_COVER = generateShareCover('movie');

export const DEFAULT_SHARE_COVER = assertDefined(
  shuffle([
    DEFAULT_SHARE_SHOW_COVER,
    DEFAULT_SHARE_MOVIE_COVER,
  ]).at(0),
  'Default share cover is required',
);
