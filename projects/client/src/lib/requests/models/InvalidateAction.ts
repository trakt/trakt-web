import type { MediaType } from './MediaType.ts';

type ExtendedMediaType = MediaType | 'episode';

const INVALIDATION_ID = 'invalidate' as const;

type AuthInvalidationTypes = 'auth';
type RateableInvalidationTypes = 'rated';
type ExtendedMediaInvalidationTypes = 'mark_as_watched';
type MediaInvalidationTypes = 'watchlisted';

export type InvalidateActionOptions =
  | `${typeof INVALIDATION_ID}:${AuthInvalidationTypes}`
  | `${typeof INVALIDATION_ID}:${RateableInvalidationTypes}:${ExtendedMediaType}`
  | `${typeof INVALIDATION_ID}:${ExtendedMediaInvalidationTypes}:${ExtendedMediaType}`
  | `${typeof INVALIDATION_ID}:${MediaInvalidationTypes}:${MediaType}`;

type TypeDataMap = {
  'auth': null;
  'rated': ExtendedMediaType;
  'mark_as_watched': ExtendedMediaType;
  'watchlisted': MediaType;
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
};
