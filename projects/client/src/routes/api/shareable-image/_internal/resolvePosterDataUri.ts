import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import { error } from '$lib/utils/console/print.ts';
import placeholderPosterDataUri from '$static/placeholders/portrait_placeholder.png?inline';
import { fetchPosterDataUri } from './fetchPosterDataUri.ts';

type ResolvePosterDataUriProps = {
  posterUrl: string;
  fetch: typeof globalThis.fetch;
};

export async function resolvePosterDataUri(
  { posterUrl, fetch }: ResolvePosterDataUriProps,
): Promise<string> {
  if (posterUrl === MEDIA_POSTER_PLACEHOLDER) {
    return placeholderPosterDataUri;
  }

  try {
    return await fetchPosterDataUri({
      posterUrl: posterUrl.replace(/\.webp$/i, ''),
      fetch,
    });
  } catch (e) {
    error('Failed to fetch poster, falling back to the placeholder:', e);
    return placeholderPosterDataUri;
  }
}
