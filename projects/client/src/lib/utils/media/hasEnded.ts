import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';

/**
 * Statuses that mean a show will not air new episodes. Every other status -
 * an unknown one included - counts as still airing, so a show only leaves the
 * "up to date" bucket when Trakt is explicit about it being over.
 */
const ENDED_STATUSES: ReadonlySet<MediaStatus> = new Set([
  'ended',
  'canceled',
]);

export function hasEnded(status: MediaStatus): boolean {
  return ENDED_STATUSES.has(status);
}
