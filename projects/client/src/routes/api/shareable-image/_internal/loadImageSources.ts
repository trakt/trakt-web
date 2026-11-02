import type { ImageSource } from '@takumi-rs/wasm';
import { loadPosterImages } from './loadPosterImages.ts';

type LoadImageSourcesProps = {
  urls: ReadonlyArray<string | Nil>;
  fetch: typeof globalThis.fetch;
};

export async function loadImageSources({
  urls,
  fetch,
}: LoadImageSourcesProps): Promise<ImageSource[]> {
  const unique = [
    ...new Set(urls.filter((url): url is string => Boolean(url))),
  ];

  const results = await Promise.allSettled(
    unique.map((posterUrl) => loadPosterImages({ posterUrl, fetch })),
  );

  return results.flatMap((result) =>
    result.status === 'fulfilled' ? result.value : [],
  );
}
