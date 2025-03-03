import type { ListResponse } from '@trakt/api';
import type { MediaListSummary } from '../models/MediaListSummary.ts';
import { mapToUserProfile } from './mapToUserProfile.ts';

export function mapToMediaListSummary(
  listResponse: ListResponse,
): MediaListSummary {
  return {
    id: listResponse.ids.trakt,
    slug: listResponse.ids.slug,
    name: listResponse.name,
    description: listResponse.description,
    user: mapToUserProfile(listResponse.user),
    count: listResponse.item_count,
  };
}
