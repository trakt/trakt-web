import type { VipVeteranTitle } from '$lib/requests/models/VipVeteranTitle.ts';
import type { UserLadderTier } from './UserLadderTier.ts';

export function toLadderTier(title: VipVeteranTitle | Nil): UserLadderTier {
  return title ?? 'vip';
}
