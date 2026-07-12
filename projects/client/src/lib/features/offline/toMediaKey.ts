import type { RatedMediaType } from '$lib/requests/models/InvalidateAction.ts';

/**
 * Canonical identity of a media item in the offline queue - enqueue sites
 * and pending-state overlays must build keys through this helper to agree.
 */
export function toMediaKey(type: RatedMediaType, id: number): string {
  return `${type}:${id}`;
}
