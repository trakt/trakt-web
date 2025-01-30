import type { MediaType } from '$lib/requests/models/MediaType';

export function mediaCardWidthResolver<M = MediaType>(
  type: M,
) {
  switch (type) {
    case 'movie':
    case 'show':
      return 'var(--width-poster-card)';
  }
}
