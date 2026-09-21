import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import placeholderPosterDataUri from '$static/placeholders/portrait_placeholder.png?inline';

export function resolvePosterSource(posterUrl: string): string {
  if (posterUrl === MEDIA_POSTER_PLACEHOLDER) {
    return placeholderPosterDataUri;
  }

  return posterUrl.replace(/\.webp$/i, '');
}
