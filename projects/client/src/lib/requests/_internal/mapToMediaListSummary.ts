import type { ListResponse } from '@trakt/api';
import type { MediaListSummary } from '../models/MediaListSummary.ts';
import { mapToPoster } from './mapToPoster.ts';
import { mapToUserProfile } from './mapToUserProfile.ts';

// FIXME: remove this when the API is fixed
const PLACEHOLDERS_PATH = 'placeholders/original/poster.png';

export function mapToMediaListSummary(
  listResponse: ListResponse,
): MediaListSummary {
  const posters = (listResponse.images?.posters ?? [])
    .filter((poster) => poster !== PLACEHOLDERS_PATH)
    .map((poster) => mapToPoster({ poster: [poster] }));

  return {
    id: listResponse.ids.trakt,
    slug: listResponse.ids.slug,
    name: listResponse.name,
    description: listResponse.description ?? '',
    user: mapToUserProfile(listResponse.user),
    count: listResponse.item_count,
    posters,
  };
}
