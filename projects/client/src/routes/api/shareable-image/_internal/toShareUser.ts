import { toVipBadgeLabel } from '$lib/components/badge/toVipBadgeLabel.ts';
import type { ShareUser } from '$lib/features/share/models/ShareUser.ts';
import { toVipVeteranLabel } from '$lib/features/vip-veteran/toVipVeteranLabel.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { toDisplayableName } from '$lib/utils/profile/toDisplayableName.ts';
import { resolvePosterSource } from './resolvePosterSource.ts';

function toBadgeLabel({ isVip, isDirector }: UserProfile) {
  if (!isVip && !isDirector) return null;

  return toVipBadgeLabel({ isDirector, label: toVipVeteranLabel(null) });
}

export function toShareUser(profile: UserProfile): ShareUser {
  return {
    name: toDisplayableName(profile),
    username: profile.name.full ? profile.username : null,
    avatarUrl: resolvePosterSource(profile.avatar.url),
    isVip: profile.isVip,
    badgeLabel: toBadgeLabel(profile),
  };
}
