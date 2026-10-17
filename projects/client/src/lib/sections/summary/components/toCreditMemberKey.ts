import type { CreditMember } from '$lib/sections/lists/models/CreditMember.ts';

export function toCreditMemberKey(member: CreditMember): string {
  return `${member.key}-${member.positions ? 'cast' : 'crew'}`;
}
