import type { ExtendedMediaType } from './ExtendedMediaType.ts';
import type { MediaType } from './MediaType.ts';

type UserType = 'avatar' | 'settings' | 'follow' | 'cover' | 'block';
type ListType = 'edited' | 'deleted' | 'created' | 'like';
type VipType = 'canceled';

const INVALIDATION_ID = 'invalidate' as const;

export type InvalidateActionOptions =
  | `${typeof INVALIDATION_ID}:auth`
  | `${typeof INVALIDATION_ID}:rated:${ExtendedMediaType}`
  | `${typeof INVALIDATION_ID}:mark_as_watched:${ExtendedMediaType}`
  | `${typeof INVALIDATION_ID}:watchlisted:${MediaType}`
  | `${typeof INVALIDATION_ID}:dropped::${MediaType}`
  | `${typeof INVALIDATION_ID}:restored:show`
  | `${typeof INVALIDATION_ID}:comment:reply`
  | `${typeof INVALIDATION_ID}:listed:${MediaType}`
  | `${typeof INVALIDATION_ID}:user:${UserType}`
  | `${typeof INVALIDATION_ID}:check_in`
  | `${typeof INVALIDATION_ID}:list:${ListType}`
  | `${typeof INVALIDATION_ID}:smart_list:${ListType}`
  | `${typeof INVALIDATION_ID}:commented:${ExtendedMediaType}`
  | `${typeof INVALIDATION_ID}:notes:${MediaType}`
  | `${typeof INVALIDATION_ID}:vip:${VipType}`
  | `${typeof INVALIDATION_ID}:hide_recommended:${MediaType}`;

type TypeDataMap = {
  'auth': null;
  'rated': ExtendedMediaType;
  'mark_as_watched': ExtendedMediaType;
  'watchlisted': MediaType;
  'dropped': MediaType;
  'restored': 'show';
  'react': 'comment';
  'comment_reply': ExtendedMediaType;
  'listed': MediaType;
  'user': UserType;
  'check_in': null;
  'favorited': MediaType;
  'commented': ExtendedMediaType;
  'list': ListType;
  'smart_list': ListType;
  'notes': MediaType;
  'vip': VipType;
  'hide_recommended': MediaType;
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

  Watchlisted: (type: MediaType) => buildInvalidationKey('watchlisted', type),
  Listed: (type: MediaType) => buildInvalidationKey('listed', type),

  Drop: (type: MediaType) => buildInvalidationKey('dropped', type),

  Restore: buildInvalidationKey('restored', 'show'),

  React: buildInvalidationKey('react', 'comment'),

  Comment: {
    Post: (type: ExtendedMediaType) => buildInvalidationKey('commented', type),
    Reply: (type: ExtendedMediaType) =>
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
  },

  Vip: {
    Canceled: buildInvalidationKey('vip', 'canceled'),
  },

  HideRecommended: (type: MediaType) =>
    buildInvalidationKey('hide_recommended', type),
};
