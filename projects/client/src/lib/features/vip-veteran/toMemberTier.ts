import type { MemberTier } from './MemberTier.ts';
import type { TieredMember } from './TieredMember.ts';
import { toVipVeteranRung } from './toVipVeteranRung.ts';

// Directors outrank every streak; VIPs without one are plain VIP.
export function toMemberTier(member: TieredMember | Nil): MemberTier {
  if (member?.isDirector) return 'director';
  if (!member?.isVip) return 'free';
  if (!member.veteran) return 'vip';

  return toVipVeteranRung(member.veteran)?.memberTier ?? 'vip';
}
