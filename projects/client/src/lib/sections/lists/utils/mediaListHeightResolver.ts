import type { MediaType } from '$lib/requests/models/MediaType';

export function mediaListHeightResolver(
  type: MediaType | 'episode' | 'person',
) {
  switch (type) {
    case 'movie':
      return 'var(--height-poster-list)';
    case 'episode':
      return 'var(--height-episode-list)';
    case 'show':
      return 'var(--height-show-list)';
    case 'person':
      return 'var(--height-person-list)';
  }
}
