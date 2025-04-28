import type { MediaType } from '$lib/requests/models/MediaType.ts';

export function mediaListHeightResolver<M = MediaType>(
  type: 'landscape' | 'portrait' | M,
) {
  switch (type) {
    case 'landscape':
      return 'var(--height-landscape-list)';
    case 'portrait':
    default:
      return 'var(--height-poster-list)';
  }
}
