import type { ListResponse } from '$lib/api.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapUserProfile.ts';
import type { MediaListSummary } from '../models/MediaListSummary.ts';

export function mapListResponseToMediaListSummary(
  listResponse: ListResponse,
): MediaListSummary {
  return {
    id: listResponse.ids.trakt,
    slug: listResponse.ids.slug,
    name: listResponse.name,
    description: listResponse.description,
    user: mapToUserProfile(listResponse.user),
  };
}
