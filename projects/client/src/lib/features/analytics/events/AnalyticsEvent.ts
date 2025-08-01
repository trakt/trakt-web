const ACTION_PREFIX = 'action';
const MEDIA_ACTION_PREFIX = 'media-action';
const USER_ACTION_PREFIX = 'user-action';
const FOLLOW_ACTION_PREFIX = 'follow-action';
const LIST_ACTION_PREFIX = 'list-action';

function buildEventKey<T extends string, K extends string>(
  prefix: T,
  action: K,
): `${T}.${K}` {
  return `${prefix}.${action}`;
}

export const AnalyticsEvent = {
  EnterLite: 'lite-on',
  NitroExperiment: 'nitro',

  Theme: buildEventKey(ACTION_PREFIX, 'theme'),
  Locale: buildEventKey(ACTION_PREFIX, 'locale'),
  Filter: buildEventKey(ACTION_PREFIX, 'filter'),

  Drop: buildEventKey(MEDIA_ACTION_PREFIX, 'drop'),
  Restore: buildEventKey(MEDIA_ACTION_PREFIX, 'restore'),
  MarkAsWatched: buildEventKey(MEDIA_ACTION_PREFIX, 'mark-as-watched'),
  Watchlist: buildEventKey(MEDIA_ACTION_PREFIX, 'watchlist'),
  List: buildEventKey(MEDIA_ACTION_PREFIX, 'list'),
  RemoveFromHistory: 'remove-from-history',
  LikeComment: buildEventKey(MEDIA_ACTION_PREFIX, 'like-comment'),
  React: buildEventKey(ACTION_PREFIX, 'react'),
  AddComment: buildEventKey(MEDIA_ACTION_PREFIX, 'add-comment'),
  Rate: buildEventKey(MEDIA_ACTION_PREFIX, 'rate'),
  CheckIn: buildEventKey(MEDIA_ACTION_PREFIX, 'check-in'),
  Extras: buildEventKey(MEDIA_ACTION_PREFIX, 'extras'),

  Settings: buildEventKey(USER_ACTION_PREFIX, 'settings'),

  Follow: buildEventKey(FOLLOW_ACTION_PREFIX, 'follow'),

  ListRename: buildEventKey(LIST_ACTION_PREFIX, 'rename'),
  ListDelete: buildEventKey(LIST_ACTION_PREFIX, 'delete'),
  ListCreate: buildEventKey(LIST_ACTION_PREFIX, 'create'),
} as const;
