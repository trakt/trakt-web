import type { MediaType } from '$lib/models/MediaType.ts';

export function buildMediaLink(type: MediaType, id: string) {
  return type === 'movie' ? `/movie/${id}` : `/show/${id}`;
}
