import type { Snippet } from 'svelte';
import type { AvatarStackProps } from '$lib/components/avatar-stack/AvatarStackProps.ts';

type AvatarPillBaseProps = {
  avatars: AvatarStackProps['avatars'];
  countLabel: string | null;
  label: string;
  caption?: string;
  badge?: Snippet;
  icon?: Snippet;
  indicator?: Snippet;
  color?: 'default' | 'red';
};

type AvatarPillLinkProps = AvatarPillBaseProps & {
  ariaLabel: string;
  href: string;
  onclick?: undefined;
  noscroll?: boolean;
  replacestate?: boolean;
};

type AvatarPillButtonProps = AvatarPillBaseProps & {
  // When provided, the pill renders as a button instead of a link (used by the
  // episode drawer, which can't route without replacing itself).
  ariaLabel: string;
  onclick: () => void;
  href?: undefined;
  noscroll?: undefined;
  replacestate?: undefined;
};

type AvatarPillStaticProps = AvatarPillBaseProps & {
  ariaLabel?: undefined;
  href?: undefined;
  onclick?: undefined;
  noscroll?: undefined;
  replacestate?: undefined;
};

export type AvatarPillProps =
  | AvatarPillLinkProps
  | AvatarPillButtonProps
  | AvatarPillStaticProps;
