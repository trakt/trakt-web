import type { ListResponse } from '$lib/api.ts';
import { DEFAULT_AVATAR } from '$lib/utils/constants.ts';
import type { MediaListSummary } from '../models/MediaListSummary.ts';

export function mapListResponseToMediaListSummary(
  listResponse: ListResponse,
): MediaListSummary {
  return {
    id: listResponse.ids.trakt,
    slug: listResponse.ids.slug,
    name: listResponse.name,
    description: listResponse.description,
    user: {
      userName: listResponse.user.username,
      isVip: listResponse.user.vip || listResponse.user.vip_ep,
      slug: listResponse.user.ids.slug,
      avatar: {
        url: listResponse.user.images?.avatar.full ?? DEFAULT_AVATAR,
      },
    },
  };
}
