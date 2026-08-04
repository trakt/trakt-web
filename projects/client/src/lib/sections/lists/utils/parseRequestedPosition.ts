import {
  type CrewPosition,
  crewPositionSchema,
} from '$lib/requests/models/CrewPosition.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

export function parseRequestedPosition(
  url: URL,
  type: MediaType,
): CrewPosition {
  return crewPositionSchema.safeParse(
    url.searchParams.get(`${type}s`)?.toLowerCase(),
  ).data ?? 'acting';
}
