/**
 * This cover is the Alien Isolation cover.
 */
export const DEFAULT_COVER =
  'https://walter-r2.trakt.tv/images/movies/000/759/944/fanarts/full/a12a59d031.jpg.webp';

export const DEFAULT_AVATAR =
  'https://walter-r2.trakt.tv/hotlink-ok/placeholders/medium/zoidberg.png' as HttpsUrl;

export const MAX_DATE = new Date('9999-12-31T23:59:59.999Z');
export const MIN_DATE = new Date('0000-01-01T00:00:00.000Z');

export const NOOP_FN = () => {
  // noop
};

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_DRILL_SIZE = 100;
export const RECOMMENDED_UPPER_LIMIT = DEFAULT_DRILL_SIZE;
export const COMMENTS_DRILL_SIZE = 25;
export const DEFAULT_SEARCH_LIMIT = 50;
export const PAGE_UPPER_LIMIT = 3;

// FIXME: reduce limit when calendar layouts are paginated
export const HISTORY_UPPER_LIMIT = 250;

export const DEFAULT_LISTS_PAGE_SIZE = 5;
export const DEFAULT_LISTS_DRILL_SIZE = 10;

export const DEFAULT_RELATED_LIMIT = 20;

/**
 * This is the default we also have server-side.
 * We expose it to tinker around and fine-tune the default value.
 */
export const RECOMMENDED_DEFAULT_WATCH_WINDOW = 25;
export const RECOMMENDED_DEFAULT_MIN_YEAR = 1990;

export const DEFAULT_SMART_LIST_LIMIT = 5;
export const UPPER_SMART_LIST_LIMIT = 100;

export const SUPPORT_EMAIL = 'support@trakt.tv';
export const COPYRIGHT_EMAIL = 'copyright@trakt.tv';

export const SENTRY_DSN =
  'https://7c03bc5bf58eb8ceb23801702a91954f@o4509870904639488.ingest.de.sentry.io/4509870926463056';
