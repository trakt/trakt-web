import type { ProfileResponse } from '$lib/api.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { DEFAULT_AVATAR } from '$lib/utils/constants.ts';

export function mapToUserProfile(user: ProfileResponse): UserProfile {
  return {
    username: user.username,
    name: user.name,
    private: user.private,
    isVip: user.vip || user.vip_ep,
    slug: user.ids.slug,
    avatar: {
      url: user.images?.avatar.full ?? DEFAULT_AVATAR,
    },
  };
}
