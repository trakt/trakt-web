import type { GifEntry } from '$lib/requests/models/GifEntry.ts';
import type { KlipyGifResponse } from './KlipyGifResponse.ts';

export function mapToGifEntry(response: KlipyGifResponse): GifEntry {
  return {
    id: `${response.id}`,
    slug: response.slug,
    title: response.title,
    preview: response.file.sm.webp ?? response.file.sm.gif,
    full: response.file.md.webp ?? response.file.md.gif,
    still: response.file.sm.jpg,
    blurPreview: response.blur_preview,
  };
}
