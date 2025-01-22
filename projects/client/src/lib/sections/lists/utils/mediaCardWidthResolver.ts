import type { MediaType } from '$lib/requests/models/MediaType';

export function mediaCardWidthResolver(
  type: MediaType,
) {
  switch (type) {
    case 'movie':
      return 'var(--width-poster-card)';
    case 'show':
      return 'var(--width-show-card)';
  }
}
