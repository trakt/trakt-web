import type { ShareUser } from '$lib/features/share/models/ShareUser.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { toDisplayableName } from '$lib/utils/profile/toDisplayableName.ts';
import { resolvePosterSource } from './resolvePosterSource.ts';

export function toShareUser(profile: UserProfile): ShareUser {
  return {
    name: toDisplayableName(profile),
    username: profile.name.full ? profile.username : null,
    avatarUrl: resolvePosterSource(profile.avatar.url),
    isVip: profile.isVip,
    isDirector: profile.isDirector,
  };
}
