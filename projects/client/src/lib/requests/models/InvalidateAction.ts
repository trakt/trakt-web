import type { CommentableMediaType } from './CommentableMediaType.ts';
import type { ExtendedMediaType } from './ExtendedMediaType.ts';
import type { MediaType } from './MediaType.ts';

type UserType = 'avatar' | 'settings' | 'follow' | 'cover' | 'block';
type ListType = 'edited' | 'deleted' | 'created' | 'like';
type VipType = 'canceled' | 'updated';
type PlexType = 'settings' | 'syncs';
type RewatchingType = 'show';

const INVALIDATION_ID = 'invalidate' as const;

export type InvalidateActionOptions =
  | `${typeof INVALIDATION_ID}:auth`
  | `${typeof INVALIDATION_ID}:rated:${ExtendedMediaType}`
  | `${typeof INVALIDATION_ID}:mark_as_watched:${ExtendedMediaType}`
  | `${typeof INVALIDATION_ID}:collected:${ExtendedMediaType}`
  | `${typeof INVALIDATION_ID}:watchlisted:${MediaType}`
  | `${typeof INVALIDATION_ID}:dropped::${MediaType}`
  | `${typeof INVALIDATION_ID}:restored:show`
  | `${typeof INVALIDATION_ID}:comment:reply`
  | `${typeof INVALIDATION_ID}:listed:${MediaType}`
  | `${typeof INVALIDATION_ID}:user:${UserType}`
  | `${typeof INVALIDATION_ID}:check_in`
  | `${typeof INVALIDATION_ID}:list:${ListType}`
  | `${typeof INVALIDATION_ID}:smart_list:${ListType}`
  | `${typeof INVALIDATION_ID}:commented:${CommentableMediaType}`
  | `${typeof INVALIDATION_ID}:notes:${MediaType}`
  | `${typeof INVALIDATION_ID}:notes_edit:${MediaType}`
  | `${typeof INVALIDATION_ID}:notes_delete:${MediaType}`
  | `${typeof INVALIDATION_ID}:vip:${VipType}`
  | `${typeof INVALIDATION_ID}:rewatching:${RewatchingType}`
  | `${typeof INVALIDATION_ID}:hide_recommended:${MediaType}`
  | `${typeof INVALIDATION_ID}:streaming_connection`
  | `${typeof INVALIDATION_ID}:data_sync`
  | `${typeof INVALIDATION_ID}:plex:${PlexType}`
  | `${typeof INVALIDATION_ID}:app_revoke`
  | `${typeof INVALIDATION_ID}:app_create`
  | `${typeof INVALIDATION_ID}:app_update`
  | `${typeof INVALIDATION_ID}:app_delete`;

type TypeDataMap = {
  'auth': null;
  'rated': ExtendedMediaType;
  'mark_as_watched': ExtendedMediaType;
  'collected': ExtendedMediaType;
  'watchlisted': MediaType;
  'dropped': MediaType;
  'restored': 'show';
  'react': 'comment';
  'comment_reply': CommentableMediaType;
  'listed': MediaType;
  'user': UserType;
  'check_in': null;
  'favorited': MediaType;
  'commented': CommentableMediaType;
  'list': ListType;
  'smart_list': ListType;
  'notes': MediaType;
  'notes_edit': MediaType;
  'notes_delete': MediaType;
  'vip': VipType;
  'rewatching': RewatchingType;
  'hide_recommended': MediaType;
  'streaming_connection': null;
  'data_sync': null;
  'plex': PlexType;
  'app_revoke': null;
  'app_create': null;
  'app_update': null;
  'app_delete': null;
};

export function invalidationId(key?: string) {
  return `${INVALIDATION_ID}:${key ?? ''}` as const;
}

// FIXME add support for more targeted invalidations, e.g. list_id:movie
function buildInvalidationKey<T extends keyof TypeDataMap>(
  key: T,
  data?: TypeDataMap[T],
): InvalidateActionOptions {
  if (data != null) {
    return invalidationId(`${key}:${data}`) as InvalidateActionOptions;
  }

  return invalidationId(`${key}`) as InvalidateActionOptions;
}

export const InvalidateAction = {
  Auth: buildInvalidationKey('auth'),

  Rated: (type: ExtendedMediaType) => buildInvalidationKey('rated', type),

  MarkAsWatched: (type: ExtendedMediaType) =>
    buildInvalidationKey('mark_as_watched', type),

  Collected: (type: ExtendedMediaType) =>
    buildInvalidationKey('collected', type),

  Watchlisted: (type: MediaType) => buildInvalidationKey('watchlisted', type),
  Listed: (type: MediaType) => buildInvalidationKey('listed', type),

  Drop: (type: MediaType) => buildInvalidationKey('dropped', type),

  Restore: buildInvalidationKey('restored', 'show'),

  React: buildInvalidationKey('react', 'comment'),

  Comment: {
    Post: (type: CommentableMediaType) =>
      buildInvalidationKey('commented', type),
    Reply: (type: CommentableMediaType) =>
      buildInvalidationKey('comment_reply', type),
  },

  User: {
    Avatar: buildInvalidationKey('user', 'avatar'),
    CoverImage: buildInvalidationKey('user', 'cover'),
    Settings: buildInvalidationKey('user', 'settings'),
    Follow: buildInvalidationKey('user', 'follow'),
    Block: buildInvalidationKey('user', 'block'),
  },

  CheckIn: buildInvalidationKey('check_in'),

  Favorited: (type: MediaType) => buildInvalidationKey('favorited', type),

  List: {
    Edited: buildInvalidationKey('list', 'edited'),
    Deleted: buildInvalidationKey('list', 'deleted'),
    Created: buildInvalidationKey('list', 'created'),
    Like: buildInvalidationKey('list', 'like'),
  },

  SmartList: {
    Created: buildInvalidationKey('smart_list', 'created'),
    Deleted: buildInvalidationKey('smart_list', 'deleted'),
  },

  Note: {
    Add: (type: MediaType) => buildInvalidationKey('notes', type),
    Edit: (type: MediaType) => buildInvalidationKey('notes_edit', type),
    Delete: (type: MediaType) => buildInvalidationKey('notes_delete', type),
  },

  Vip: {
    Canceled: buildInvalidationKey('vip', 'canceled'),
    Updated: buildInvalidationKey('vip', 'updated'),
  },

  Rewatching: (type: RewatchingType) =>
    buildInvalidationKey('rewatching', type),

  HideRecommended: (type: MediaType) =>
    buildInvalidationKey('hide_recommended', type),

  StreamingSync: {
    Connection: buildInvalidationKey('streaming_connection'),
    Sync: buildInvalidationKey('data_sync'),
  },

  Plex: {
    Settings: buildInvalidationKey('plex', 'settings'),
    Syncs: buildInvalidationKey('plex', 'syncs'),
  },

  App: {
    Revoke: buildInvalidationKey('app_revoke'),
    Create: buildInvalidationKey('app_create'),
    Update: buildInvalidationKey('app_update'),
    Delete: buildInvalidationKey('app_delete'),
  },
};
