const ACTION_PREFIX = 'action';
const MEDIA_ACTION_PREFIX = 'media-action';
const USER_ACTION_PREFIX = 'user-action';
const FOLLOW_ACTION_PREFIX = 'follow-action';
const LIST_ACTION_PREFIX = 'list-action';
const CALENDAR_ACTION_PREFIX = 'calendar-action';
const SEASONAL_ACTION_PREFIX = 'seasonal-action';
const BANNER_ACTION_PREFIX = 'banner-action';
const VIP_ACTION_PREFIX = 'vip-action';
const SMART_LIST_ACTION_PREFIX = 'smart-list-action';
const DATA_IMPORT_ACTION_PREFIX = 'data-import';
const DATA_EXPORT_ACTION_PREFIX = 'data-export';
const DATA_CLEAR_ACTION_PREFIX = 'data-clear';
const TODAY_PREFIX = 'today';
const MIXTAPE_PREFIX = 'mixtape';
const RECOMMENDATIONS_PREFIX = 'recommendations';

function buildEventKey<T extends string, K extends string>(
  prefix: T,
  action: K,
): `${T}.${K}` {
  return `${prefix}.${action}`;
}

export const AnalyticsEvent = {
  PageView: 'page_view',
  EnterLite: 'lite-on',
  PublicRedirect: 'public-redirect',
  NonVipRedirect: 'non-vip-redirect',
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
  ShareArrival: 'share.arrival',

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
  Soundtrack: buildEventKey(MEDIA_ACTION_PREFIX, 'soundtrack'),
  StreamOn: buildEventKey(MEDIA_ACTION_PREFIX, 'stream-on'),
  HideRecommendation: buildEventKey(MEDIA_ACTION_PREFIX, 'hide-recommendation'),

  Settings: buildEventKey(USER_ACTION_PREFIX, 'settings'),
  CoverImage: buildEventKey(USER_ACTION_PREFIX, 'cover-image'),

  Follow: buildEventKey(FOLLOW_ACTION_PREFIX, 'follow'),
  Block: buildEventKey(USER_ACTION_PREFIX, 'block'),

  ListEdit: buildEventKey(LIST_ACTION_PREFIX, 'edit'),
  ListDelete: buildEventKey(LIST_ACTION_PREFIX, 'delete'),
  ListCreate: buildEventKey(LIST_ACTION_PREFIX, 'create'),
  ListSort: buildEventKey(LIST_ACTION_PREFIX, 'sort'),
  ListLike: buildEventKey(LIST_ACTION_PREFIX, 'like'),

  CalendarPeriod: buildEventKey(CALENDAR_ACTION_PREFIX, 'period'),
  CalendarFeed: buildEventKey(CALENDAR_ACTION_PREFIX, 'feed'),

  SeasonalFilter: buildEventKey(SEASONAL_ACTION_PREFIX, 'filter'),

  BannerDismiss: buildEventKey(BANNER_ACTION_PREFIX, 'dismiss'),
  VipUpsell: buildEventKey(ACTION_PREFIX, 'vip-upsell'),
  VipUpsellImpression: buildEventKey(ACTION_PREFIX, 'vip-upsell-impression'),

  VipView: buildEventKey(VIP_ACTION_PREFIX, 'vip-view'),
  VipUpgrade: buildEventKey(VIP_ACTION_PREFIX, 'vip-upgrade'),
  VipCheckoutFailed: buildEventKey(VIP_ACTION_PREFIX, 'checkout-failed'),
  VipCheckoutCanceled: buildEventKey(VIP_ACTION_PREFIX, 'checkout-canceled'),
  VipConfirmed: buildEventKey(VIP_ACTION_PREFIX, 'vip-confirmed'),
  VipConfirmFailed: buildEventKey(VIP_ACTION_PREFIX, 'confirm-failed'),
  VipGate: buildEventKey(VIP_ACTION_PREFIX, 'vip-gate'),
  VipManage: buildEventKey(VIP_ACTION_PREFIX, 'vip-manage'),
  VipCancel: buildEventKey(VIP_ACTION_PREFIX, 'vip-cancel'),

  SmartListDelete: buildEventKey(SMART_LIST_ACTION_PREFIX, 'delete'),
  SmartListCreate: buildEventKey(SMART_LIST_ACTION_PREFIX, 'create'),
  SmartListUpdate: buildEventKey(SMART_LIST_ACTION_PREFIX, 'update'),

  AddNote: buildEventKey(MEDIA_ACTION_PREFIX, 'add-note'),
  EditNote: buildEventKey(MEDIA_ACTION_PREFIX, 'edit-note'),
  DeleteNote: buildEventKey(MEDIA_ACTION_PREFIX, 'delete-note'),

  // Data Import
  ImportInitiated: buildEventKey(DATA_IMPORT_ACTION_PREFIX, 'initiated'),
  ImportCompleted: buildEventKey(DATA_IMPORT_ACTION_PREFIX, 'completed'),
  ImportFailed: buildEventKey(DATA_IMPORT_ACTION_PREFIX, 'failed'),

  // Data Export
  ExportInitiated: buildEventKey(DATA_EXPORT_ACTION_PREFIX, 'initiated'),
  ExportCompleted: buildEventKey(DATA_EXPORT_ACTION_PREFIX, 'completed'),
  ExportFailed: buildEventKey(DATA_EXPORT_ACTION_PREFIX, 'failed'),

  // Data Clear
  ClearInitiated: buildEventKey(DATA_CLEAR_ACTION_PREFIX, 'initiated'),
  ClearCompleted: buildEventKey(DATA_CLEAR_ACTION_PREFIX, 'completed'),
  ClearFailed: buildEventKey(DATA_CLEAR_ACTION_PREFIX, 'failed'),

  // Today
  TodayOpen: buildEventKey(TODAY_PREFIX, 'open'),
  TodayStory: buildEventKey(TODAY_PREFIX, 'story'),
  TodayClose: buildEventKey(TODAY_PREFIX, 'close'),
  TodayAction: buildEventKey(TODAY_PREFIX, 'action'),
  TodayGrouping: buildEventKey(TODAY_PREFIX, 'grouping'),
  TodayDay: buildEventKey(TODAY_PREFIX, 'day'),

  MixtapeOpen: buildEventKey(MIXTAPE_PREFIX, 'open'),
  MixtapePick: buildEventKey(MIXTAPE_PREFIX, 'pick'),
  MixtapeNoFits: buildEventKey(MIXTAPE_PREFIX, 'no-fits'),
  MixtapeMix: buildEventKey(MIXTAPE_PREFIX, 'mix'),
  MixtapeResult: buildEventKey(MIXTAPE_PREFIX, 'result'),

  Favorite: buildEventKey(MEDIA_ACTION_PREFIX, 'favorite'),
  Rewatching: buildEventKey(MEDIA_ACTION_PREFIX, 'rewatching'),

  LoginStart: 'auth-action.login-start',
  LoginComplete: 'auth-action.login-complete',
  LoginFailed: 'auth-action.login-failed',
  Logout: 'auth-action.logout',

  OnboardingStep: 'onboarding.step',

  PlexConnect: 'plex-action.connect',
  PlexSync: 'plex-action.sync',
  PlexServer: 'plex-action.server',
  PlexSetting: 'plex-action.setting',

  StreamingService: 'streaming-action.service',

  PreviewFeature: buildEventKey(USER_ACTION_PREFIX, 'preview-feature'),

  OfflineQueued: 'offline.queued',
  OfflineReplayed: 'offline.replayed',

  PwaInstall: buildEventKey(ACTION_PREFIX, 'pwa-install'),

  RecommendationMode: buildEventKey(RECOMMENDATIONS_PREFIX, 'mode'),
  RecommendationWhy: buildEventKey(RECOMMENDATIONS_PREFIX, 'why'),

  ListCollaborator: buildEventKey(LIST_ACTION_PREFIX, 'collaborator'),
  MuteSharer: buildEventKey(USER_ACTION_PREFIX, 'mute-sharer'),
  ReportOpen: buildEventKey(ACTION_PREFIX, 'report-open'),
  Report: buildEventKey(ACTION_PREFIX, 'report'),
  SpoilerReveal: buildEventKey(ACTION_PREFIX, 'spoiler-reveal'),
  GifPicker: buildEventKey(ACTION_PREFIX, 'gif-picker'),
  RevokeApp: buildEventKey(USER_ACTION_PREFIX, 'revoke-app'),
  DeleteAccount: buildEventKey(USER_ACTION_PREFIX, 'delete-account'),
} as const;
