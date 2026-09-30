import type { UserProfile } from '$lib/requests/models/UserProfile.ts';

export type AvatarStackUser = Pick<
  UserProfile,
  'avatar' | 'slug' | 'username' | 'isVip'
>;

export type AvatarStackProps = {
  avatars: ReadonlyArray<{ key: string; user: AvatarStackUser }>;
  size?: 'small' | 'normal';
  variant?: 'default' | 'cutout';
  linked?: boolean;
  mobileLimit?: number;
};
