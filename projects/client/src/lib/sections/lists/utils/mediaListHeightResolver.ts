import type { MediaType } from '$lib/requests/models/MediaType.ts';

export function mediaListHeightResolver<M = MediaType>(
  type: M,
) {
  switch (type) {
    case 'episode':
      return 'var(--height-episode-list)';
    case 'person':
      return 'var(--height-person-list)';
    default:
      return 'var(--height-poster-list)';
  }
}
