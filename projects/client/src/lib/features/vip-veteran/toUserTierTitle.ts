import type { UserTier } from './UserTier.ts';

export function toUserTierTitle(tier: UserTier): string {
  if (tier === 'vip') return 'VIP';

  return `${tier.charAt(0).toUpperCase()}${tier.slice(1)}`;
}
