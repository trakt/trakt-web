import { isHttpUrl } from '$lib/utils/url/isHttpUrl.ts';

type WarmPosterProps = {
  posterUrl: string;
  fetch: typeof globalThis.fetch;
};

export function warmPoster({ posterUrl, fetch }: WarmPosterProps) {
  if (!isHttpUrl(posterUrl)) {
    return Promise.resolve();
  }

  return fetch(posterUrl)
    .then((response) => response.arrayBuffer())
    .then(() => undefined, () => undefined);
}
