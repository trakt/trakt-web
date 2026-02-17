import type { ListResponse } from '@trakt/api';
import { type ListType, ListTypeSchema } from '../models/ListType.ts';
import type { MediaListSummary } from '../models/MediaListSummary.ts';
import { mapToPoster } from './mapToPoster.ts';
import { mapToUserProfile } from './mapToUserProfile.ts';

function mapToType(type: string): ListType {
  const parsed = ListTypeSchema.safeParse(type);
  if (parsed.success) {
    return parsed.data;
  }

  return 'personal';
}

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
    likeCount: listResponse.likes,
    updatedAt: new Date(listResponse.updated_at),
    sortHow: listResponse.sort_how,
    sortBy: listResponse.sort_by,
    posters,
    type: mapToType(listResponse.type),
  };
}
