const ACTION_PREFIX = 'action';
const MEDIA_ACTION_PREFIX = 'media-action';
const USER_ACTION_PREFIX = 'user-action';
const FOLLOW_ACTION_PREFIX = 'follow-action';
const LIST_ACTION_PREFIX = 'list-action';
const CALENDAR_ACTION_PREFIX = 'calendar-action';
const SEASONAL_ACTION_PREFIX = 'seasonal-action';
const BANNER_ACTION_PREFIX = 'banner-action';

function buildEventKey<T extends string, K extends string>(
  prefix: T,
  action: K,
): `${T}.${K}` {
  return `${prefix}.${action}`;
}

export const AnalyticsEvent = {
  EnterLite: 'lite-on',
  PublicRedirect: 'public-redirect',
  Cta: 'cta',
  DiscoverMode: 'discover-mode',

  Theme: buildEventKey(ACTION_PREFIX, 'theme'),
  Locale: buildEventKey(ACTION_PREFIX, 'locale'),
  Link: buildEventKey(ACTION_PREFIX, 'link'),
  Filter: buildEventKey(ACTION_PREFIX, 'filter'),
  Filters: buildEventKey(ACTION_PREFIX, 'filters'),
  Drilldown: buildEventKey(ACTION_PREFIX, 'drilldown'),
  SummaryDrilldown: buildEventKey(ACTION_PREFIX, 'summary-drilldown'),
  Search: buildEventKey(ACTION_PREFIX, 'search'),
  Share: buildEventKey(ACTION_PREFIX, 'share'),

  Drop: buildEventKey(MEDIA_ACTION_PREFIX, 'drop'),
  Restore: buildEventKey(MEDIA_ACTION_PREFIX, 'restore'),
  MarkAsWatched: buildEventKey(MEDIA_ACTION_PREFIX, 'mark-as-watched'),
  Watchlist: buildEventKey(MEDIA_ACTION_PREFIX, 'watchlist'),
  List: buildEventKey(MEDIA_ACTION_PREFIX, 'list'),
  RemoveFromHistory: 'remove-from-history',
  React: buildEventKey(ACTION_PREFIX, 'react'),
  AddComment: buildEventKey(MEDIA_ACTION_PREFIX, 'add-comment'),
  DeleteComment: buildEventKey(MEDIA_ACTION_PREFIX, 'delete-comment'),
  Rate: buildEventKey(MEDIA_ACTION_PREFIX, 'rate'),
  CheckIn: buildEventKey(MEDIA_ACTION_PREFIX, 'check-in'),
  Extras: buildEventKey(MEDIA_ACTION_PREFIX, 'extras'),
  Trailer: buildEventKey(MEDIA_ACTION_PREFIX, 'trailer'),
  StreamOn: buildEventKey(MEDIA_ACTION_PREFIX, 'stream-on'),

  Settings: buildEventKey(USER_ACTION_PREFIX, 'settings'),
  CoverImage: buildEventKey(USER_ACTION_PREFIX, 'cover-image'),

  Follow: buildEventKey(FOLLOW_ACTION_PREFIX, 'follow'),

  ListRename: buildEventKey(LIST_ACTION_PREFIX, 'rename'),
  ListDelete: buildEventKey(LIST_ACTION_PREFIX, 'delete'),
  ListCreate: buildEventKey(LIST_ACTION_PREFIX, 'create'),

  CalendarPeriod: buildEventKey(CALENDAR_ACTION_PREFIX, 'period'),

  SeasonalFilter: buildEventKey(SEASONAL_ACTION_PREFIX, 'filter'),

  BannerDismiss: buildEventKey(BANNER_ACTION_PREFIX, 'dismiss'),
} as const;
