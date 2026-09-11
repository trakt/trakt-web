import type { GifEntry } from '$lib/requests/models/GifEntry.ts';
import type { KlipyGifResponse } from './KlipyGifResponse.ts';

export function mapToGifEntry(response: KlipyGifResponse): GifEntry {
  return {
    id: `${response.id}`,
    slug: response.slug,
    title: response.title,
    // Animated webp is roughly a fifth of the gif's weight, and the grid holds
    // dozens at once. Falls back to the gif where Klipy has no webp.
    preview: response.file.sm.webp ?? response.file.sm.gif,
    url: response.file.md.gif.url,
    still: response.file.sm.jpg,
    blurPreview: response.blur_preview,
  };
}
