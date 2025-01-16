import type { MediaType } from '$lib/models/MediaType.ts';

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
