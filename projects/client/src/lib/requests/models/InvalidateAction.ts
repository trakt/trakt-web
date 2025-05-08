import type { MediaType } from './MediaType.ts';

type ExtendedMediaType = MediaType | 'episode';

const INVALIDATION_ID = 'invalidate' as const;

export type InvalidateActionOptions =
  | `${typeof INVALIDATION_ID}:auth`
  | `${typeof INVALIDATION_ID}:rated:${ExtendedMediaType}`
  | `${typeof INVALIDATION_ID}:mark_as_watched:${ExtendedMediaType}`
  | `${typeof INVALIDATION_ID}:watchlisted:${MediaType}`
  | `${typeof INVALIDATION_ID}:dropped:show`
  | `${typeof INVALIDATION_ID}:restored:show`
  | `${typeof INVALIDATION_ID}:like:comment`
  | `${typeof INVALIDATION_ID}:comment:reply`
  | `${typeof INVALIDATION_ID}:listed:${MediaType}`
  | `${typeof INVALIDATION_ID}:user:avatar`;

type TypeDataMap = {
  'auth': null;
  'rated': ExtendedMediaType;
  'mark_as_watched': ExtendedMediaType;
  'watchlisted': MediaType;
  'dropped': 'show';
  'restored': 'show';
  'like': 'comment';
  'comment': 'reply';
  'listed': MediaType;
  'user': 'avatar';
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

  Drop: buildInvalidationKey('dropped', 'show'),
  Restore: buildInvalidationKey('restored', 'show'),

  Like: buildInvalidationKey('like', 'comment'),

  ReplyToComment: buildInvalidationKey('comment', 'reply'),

  User: {
    Avatar: buildInvalidationKey('user', 'avatar'),
  },
};
