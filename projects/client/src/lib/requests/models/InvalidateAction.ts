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
  | `${typeof INVALIDATION_ID}:like:comment`;

type TypeDataMap = {
  'auth': null;
  'rated': ExtendedMediaType;
  'mark_as_watched': ExtendedMediaType;
  'watchlisted': MediaType;
  'dropped': 'show';
  'restored': 'show';
  'like': 'comment';
};

export function invalidationId(key?: string) {
  return `${INVALIDATION_ID}:${key ?? ''}` as const;
}

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

  Drop: buildInvalidationKey('dropped', 'show'),
  Restore: buildInvalidationKey('restored', 'show'),

  Like: buildInvalidationKey('like', 'comment'),
};
