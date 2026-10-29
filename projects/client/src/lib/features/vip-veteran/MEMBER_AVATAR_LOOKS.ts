import type { TierAuraProps } from '$lib/components/tier-aura/TierAuraProps.ts';
import type { MemberAvatarSize } from './MemberAvatarSize.ts';

type MemberAvatarLook = Required<Pick<TierAuraProps, 'variant' | 'motion'>>;

export const MEMBER_AVATAR_LOOKS: Record<MemberAvatarSize, MemberAvatarLook> = {
  stack: { variant: 'inset', motion: 'still' },
  small: { variant: 'compact', motion: 'still' },
  medium: { variant: 'compact', motion: 'hover' },
  large: { variant: 'full', motion: 'live' },
};
