import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { DEFAULT_AVATAR } from '$lib/utils/constants.ts';
import { toUserName } from '$lib/utils/formatting/string/toUserName.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { ProfileResponse } from '@trakt/api';

export function mapToUserProfile(user: ProfileResponse): UserProfile {
  const cover = user.vip_cover_image
    ? { url: prependHttps(user.vip_cover_image) }
    : undefined;

  return {
    username: user.username,
    name: toUserName(user.name),
    private: user.private,
    isVip: Boolean(user.vip ?? user.vip_ep),
    isDirector: Boolean(user.director),
    isDeleted: user.deleted,
    slug: user.ids.slug,
    avatar: {
      url: prependHttps(user.images?.avatar.full, DEFAULT_AVATAR),
    },
    location: user.location,
    about: user.about,
    cover,
  };
}
