import type { UserDroppedHistory } from '$lib/features/auth/queries/currentUserDroppedQuery.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';

export function isMediaDropped(
  media: MediaEntry,
  dropped: UserDroppedHistory | undefined,
): boolean {
  if (media.type !== 'show') return false;
  if (!dropped) return false;

  return dropped.shows.has(media.id);
}
