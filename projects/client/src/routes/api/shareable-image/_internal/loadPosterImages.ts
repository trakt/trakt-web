import { isHttpUrl } from '$lib/utils/url/isHttpUrl.ts';
import type { ImageSource } from '@takumi-rs/wasm';

type LoadPosterImagesProps = {
  posterUrl: string;
  fetch: typeof globalThis.fetch;
};

export async function loadPosterImages(
  { posterUrl, fetch }: LoadPosterImagesProps,
): Promise<ImageSource[]> {
  if (!isHttpUrl(posterUrl)) {
    return [];
  }

  const response = await fetch(posterUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch poster: ${response.status}`);
  }

  return [{ src: posterUrl, data: await response.arrayBuffer() }];
}
