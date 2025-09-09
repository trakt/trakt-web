import type { UserProfile } from '$lib/requests/models/UserProfile.ts';

export type DisplayableProfileProps = {
  // FIXME: merge part of usersettings with userprofile and use common type here
  profile: Omit<
    UserProfile,
    'isDeleted' | 'private' | 'slug'
  >;
  slug: string;
};
