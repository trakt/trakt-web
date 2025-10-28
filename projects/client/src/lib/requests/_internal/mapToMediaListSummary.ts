import type { ListResponse } from '@trakt/api';
import type { MediaListSummary } from '../models/MediaListSummary.ts';
import { mapToPoster } from './mapToPoster.ts';
import { mapToUserProfile } from './mapToUserProfile.ts';

export function mapToMediaListSummary(
  listResponse: ListResponse,
): MediaListSummary {
  const posters = (listResponse.images?.posters ?? [])
    .map((poster) => mapToPoster({ poster: [poster] }));

  return {
    id: listResponse.ids.trakt,
    key: `list-${listResponse.ids.trakt}`,
    slug: listResponse.ids.slug,
    name: listResponse.name,
    description: listResponse.description ?? '',
    user: mapToUserProfile(listResponse.user),
    count: listResponse.item_count,
    updatedAt: new Date(listResponse.updated_at),
    posters,
  };
}
