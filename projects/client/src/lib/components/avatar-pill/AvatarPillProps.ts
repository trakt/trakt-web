import type { UserProfile } from '$lib/requests/models/UserProfile.ts';

export type AvatarPillUser = Pick<
  UserProfile,
  'avatar' | 'slug' | 'username' | 'isVip'
>;

type AvatarPillBaseProps = {
  avatars: Array<{ key: string; user: AvatarPillUser }>;
  countLabel: string | null;
  label: string;
  ariaLabel: string;
};

type AvatarPillLinkProps = AvatarPillBaseProps & {
  href: string;
  onclick?: undefined;
  noscroll?: boolean;
  replacestate?: boolean;
};

type AvatarPillButtonProps = AvatarPillBaseProps & {
  // When provided, the pill renders as a button instead of a link (used by the
  // episode drawer, which can't route without replacing itself).
  onclick: () => void;
  href?: undefined;
  noscroll?: undefined;
  replacestate?: undefined;
};

export type AvatarPillProps = AvatarPillLinkProps | AvatarPillButtonProps;
