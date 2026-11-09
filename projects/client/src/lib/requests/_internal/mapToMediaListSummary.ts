import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import type { ListResponse } from '@trakt/api';
import { type ListPrivacy, ListPrivacySchema } from '../models/ListPrivacy.ts';
import { type ListType, ListTypeSchema } from '../models/ListType.ts';
import type { MediaListSummary } from '../models/MediaListSummary.ts';
import { toImageUrls } from './toImageUrls.ts';
import { mapToUserProfile } from './mapToUserProfile.ts';

function mapToType(type: string): ListType {
  const parsed = ListTypeSchema.safeParse(type);
  if (parsed.success) {
    return parsed.data;
  }

  return 'personal';
}

function mapToPrivacy(privacy: string): ListPrivacy {
  const parsed = ListPrivacySchema.safeParse(privacy);
  if (parsed.success) {
    return parsed.data;
  }

  return 'public';
}

export function mapToMediaListSummary(
  listResponse: ListResponse,
): MediaListSummary {
  const posters = (listResponse.images?.posters ?? []).map((poster) =>
    toImageUrls({
      candidates: [poster],
      mediumPlaceholder: MEDIA_POSTER_PLACEHOLDER,
      thumbPlaceholder: MEDIA_POSTER_PLACEHOLDER,
    }),
  );

  return {
    id: listResponse.ids.trakt,
    key: `list-${listResponse.ids.trakt}`,
    slug: listResponse.ids.slug,
    name: listResponse.name,
    description: listResponse.description ?? '',
    user: mapToUserProfile(listResponse.user),
    count: listResponse.item_count,
    likeCount: listResponse.likes,
    createdAt: new Date(listResponse.created_at),
    updatedAt: new Date(listResponse.updated_at),
    sortHow: listResponse.sort_how,
    sortBy: listResponse.sort_by,
    posters,
    type: mapToType(listResponse.type),
    privacy: mapToPrivacy(listResponse.privacy),
    staleOrigin: listResponse.stale_origin ?? null,
    convertedTo: listResponse.converted_to
      ? { slug: listResponse.converted_to.ids.slug }
      : null,
  };
}
