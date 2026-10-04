import { assets } from '$app/paths';
import { shuffle } from '$lib/utils/array/shuffle.ts';
import { assertDefined } from './assert/assertDefined.ts';
import { UrlBuilder } from './url/UrlBuilder.ts';

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

export const DEFAULT_SHARE_SHOW_COVER = UrlBuilder.api
  .trendingShareableImage('show')
  .openGraph();
export const DEFAULT_SHARE_MOVIE_COVER = UrlBuilder.api
  .trendingShareableImage('movie')
  .openGraph();

export const DEFAULT_SHARE_COVER = assertDefined(
  // Bracket access instead of .at(): this runs at module-eval on the boot
  // path and Array.prototype.at throws on old/spoofed WebView engines.
  shuffle([
    DEFAULT_SHARE_SHOW_COVER,
    DEFAULT_SHARE_MOVIE_COVER,
  ])[0],
  'Default share cover is required',
);
