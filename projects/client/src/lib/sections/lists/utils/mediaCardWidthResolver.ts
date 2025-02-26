import type { MediaType } from '$lib/requests/models/MediaType.ts';

export function mediaCardWidthResolver<M = MediaType>(
  type: M,
) {
  switch (type) {
    case 'episode':
      return 'var(--width-episode-card)';
    default:
      return 'var(--width-poster-card)';
  }
}
