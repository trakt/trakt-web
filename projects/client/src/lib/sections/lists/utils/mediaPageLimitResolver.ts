import type { MediaType } from '$lib/models/MediaType';

export function mediaPageLimitResolver(type: MediaType) {
  // TODO: these values are hardcoded to best fit 1080p screens
  // we'll revisit this with something more dynamic in the future
  // currently we're waiting for the new expanded (with more metadata) card designs
  switch (type) {
    case 'show':
      return 21;
    case 'movie':
      return 20;
  }
}
