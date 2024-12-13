import type { MediaType } from '$lib/models/MediaType.ts';

export function mediaListHeightResolver(type: MediaType) {
  switch (type) {
    case 'movie':
      return 'var(--height-poster-list)';
    case 'episode':
      return 'var(--height-episode-list)';
    case 'show':
      return 'var(--height-show-list)';
  }
}
