import type { UserTier } from './UserTier.ts';
import type { TieredUser } from './TieredUser.ts';
import { toLadderTier } from './toLadderTier.ts';

export function toUserTier(member: TieredUser | Nil): UserTier {
  if (!member?.isVip) return 'free';

  return toLadderTier(member.veteran?.title);
}
