import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { DEFAULT_AVATAR } from '$lib/utils/constants.ts';
import { toUserName } from '$lib/utils/formatting/string/toUserName.ts';
import type { ProfileResponse } from '@trakt/api';

export function mapToUserProfile(user: ProfileResponse): UserProfile {
  return {
    username: user.username,
    name: toUserName(user.name),
    private: user.private,
    isVip: user.vip || user.vip_ep,
    isDeleted: user.deleted,
    slug: user.ids.slug,
    avatar: {
      url: user.images?.avatar.full ?? DEFAULT_AVATAR,
    },
  };
}
