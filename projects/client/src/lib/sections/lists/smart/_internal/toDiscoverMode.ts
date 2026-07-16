import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import type { SmartList } from '$lib/requests/queries/users/smartListQuery.ts';

export function toDiscoverMode(
  mediaType: SmartList['mediaType'],
): DiscoverMode {
  switch (mediaType) {
    case 'movies':
      return 'movie';
    case 'shows':
      return 'show';
    case 'media':
      return 'media';
  }
}
