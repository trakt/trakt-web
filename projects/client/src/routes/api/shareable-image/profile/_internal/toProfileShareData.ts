import type { ProfileShareData } from '$lib/features/share/models/ProfileShareData.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { toShareUser } from '../../_internal/toShareUser.ts';

export function toProfileShareData(profile: UserProfile): ProfileShareData {
  const isPublic = !profile.private;

  return {
    user: toShareUser(profile),
    joinedYear: profile.joinedAt?.getUTCFullYear(),
    location: isPublic ? profile.location?.trim() || null : null,
    coverUrl: isPublic ? profile.cover?.url : null,
  };
}
