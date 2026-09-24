import type { FontDetails } from '@takumi-rs/wasm';
import { shareFontSources } from './shareFontSources.ts';

const MEDIA_ORIGIN = 'https://media.trakt.tv';

let fallbackFonts: Promise<FontDetails[]> | undefined;

async function fetchFonts(
  fetch: typeof globalThis.fetch,
): Promise<FontDetails[]> {
  return await Promise.all(
    shareFontSources.map(async ({ name, path, weight }) => {
      const url = `${MEDIA_ORIGIN}/${path}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch fallback font: ${url}`);
      }

      return {
        name,
        data: await response.arrayBuffer(),
        weight,
        style: 'normal',
      };
    }),
  );
}

export function loadFallbackShareFonts(
  fetch: typeof globalThis.fetch,
): Promise<FontDetails[]> {
  fallbackFonts ??= fetchFonts(fetch).catch((e: unknown) => {
    fallbackFonts = undefined;
    throw e;
  });

  return fallbackFonts;
}
