import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';

export function toGifSuggestedQuery(media: MediaEntry) {
  return `${media.title} ${media.type}`;
}
