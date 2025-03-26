import type { UserProfile } from '$lib/requests/models/UserProfile.ts';

export type DisplayableProfileProps = {
  profile: Omit<
    UserProfile,
    'username' | 'isDeleted' | 'private' | 'slug'
  >;
  slug: string;
};
