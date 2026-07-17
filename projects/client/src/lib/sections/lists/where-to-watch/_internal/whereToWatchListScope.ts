import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';

export function whereToWatchListScope(type: ExtendedMediaType) {
  return `where-to-watch-list-${type}`;
}
