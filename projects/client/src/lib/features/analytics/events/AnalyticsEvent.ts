const ACTION_PREFIX = 'action';
const MEDIA_ACTION_PREFIX = 'media-action';

function buildEventKey<T extends string, K extends string>(
  prefix: T,
  action: K,
): `${T}.${K}` {
  return `${prefix}.${action}`;
}

export const AnalyticsEvent = {
  EnterLite: 'lite-on',
  LeaveLite: 'lite-off',
  NitroExperiment: 'nitro',

  Theme: buildEventKey(ACTION_PREFIX, 'theme'),
  Locale: buildEventKey(ACTION_PREFIX, 'locale'),

  Drop: buildEventKey(MEDIA_ACTION_PREFIX, 'drop'),
  Restore: buildEventKey(MEDIA_ACTION_PREFIX, 'restore'),
  MarkAsWatched: buildEventKey(MEDIA_ACTION_PREFIX, 'mark-as-watched'),
  Watchlist: buildEventKey(MEDIA_ACTION_PREFIX, 'watchlist'),
  RemoveFromHistory: 'remove-from-history',
  LikeComment: buildEventKey(MEDIA_ACTION_PREFIX, 'like-comment'),
} as const;
