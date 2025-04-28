import type { MediaType } from '$lib/requests/models/MediaType.ts';

export function mediaCardWidthResolver<M = MediaType>(
  type: M,
) {
  switch (type) {
    case 'landscape':
    case 'episode':
      return 'var(--width-landscape-card)';
    case 'portrait':
    default:
      return 'var(--width-portrait-card)';
  }
}
