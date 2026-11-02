import type { ProfileShareData } from '$lib/features/share/models/ProfileShareData.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { toShareUser } from '../../_internal/toShareUser.ts';

export function toProfileShareData(profile: UserProfile): ProfileShareData {
  return {
    user: toShareUser(profile),
    joinedYear: profile.joinedAt?.getUTCFullYear(),
  };
}
