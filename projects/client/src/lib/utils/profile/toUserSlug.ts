type UserWithSlug = {
  slug?: string | Nil;
  username: string;
};

export function toUserSlug(profile: UserWithSlug): string {
  return profile.slug ?? profile.username;
}
