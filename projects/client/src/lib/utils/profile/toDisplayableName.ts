type UserWithName = {
  username: string;
  name: {
    full: string;
  };
};

export function toDisplayableName(profile: UserWithName) {
  if (profile.name.full) {
    return profile.name.full;
  }

  return `@${profile.username}`;
}
