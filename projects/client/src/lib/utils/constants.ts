import { browser } from '$app/environment';
import { assets } from '$app/paths';
import { shuffle } from '$lib/utils/array/shuffle.ts';
import { getDeviceType } from '$lib/utils/devices/getDeviceType.ts';
import { assertDefined } from './assert/assertDefined.ts';

/**
 * This cover is the Alien Isolation cover.
 */
export const DEFAULT_COVER =
  'https://walter-r2.trakt.tv/images/movies/000/759/944/fanarts/full/a12a59d031.jpg.webp';

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

export const DEFAULT_TRAILER = 'https://www.youtube.com/watch?v=o-YBDTqX_ZU';

export const DEFAULT_AVATAR =
  'https://walter-r2.trakt.tv/hotlink-ok/placeholders/medium/zoidberg.png' as HttpsUrl;

export const MAX_DATE = new Date('9999-12-31T23:59:59.999Z');
export const MIN_DATE = new Date('0000-01-01T00:00:00.000Z');

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

export const NOOP_FN = () => {
  // noop
};

const IS_TV = browser && getDeviceType(navigator.userAgent) === 'tv';
export const DEFAULT_PAGE_SIZE = IS_TV ? 10 : 25;
export const DEFAULT_ACTIVITY_PAGE_SIZE = 100;

export const DEFAULT_DRILL_SIZE = 100;
export const RECOMMENDED_UPPER_LIMIT = DEFAULT_DRILL_SIZE;
export const DEFAULT_SEARCH_LIMIT = 50;
export const PAGE_UPPER_LIMIT = 3;
/**
 * This is the default we also have server-side.
 * We expose it to tinker around and fine-tune the default value.
 */
export const RECOMMENDED_DEFAULT_WATCH_WINDOW = 25;
export const RECOMMENDED_DEFAULT_MIN_YEAR = 1990;

export const DEFAULT_SMART_LIST_LIMIT = 10;

export const SENTRY_DSN =
  'https://7c03bc5bf58eb8ceb23801702a91954f@o4509870904639488.ingest.de.sentry.io/4509870926463056';
