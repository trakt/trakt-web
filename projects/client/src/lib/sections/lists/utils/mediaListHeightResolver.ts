import type { MediaType } from '$lib/requests/models/MediaType.ts';

export function mediaListHeightResolver<M = MediaType>(
  type: M,
) {
  switch (type) {
    case 'landscape':
    case 'episode':
      return 'var(--height-landscape-list)';
    case 'person':
      return 'var(--height-person-list)';
    case 'portrait':
    default:
      return 'var(--height-poster-list)';
  }
}
