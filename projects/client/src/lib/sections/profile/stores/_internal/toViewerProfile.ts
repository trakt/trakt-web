import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';

export function toViewerProfile(user: UserSettings): UserProfile {
  return {
    id: Number(user.id),
    key: user.key,
    username: user.username,
    name: user.name,
    private: user.isPrivate,
    isVip: user.isVip,
    isDirector: user.isDirector,
    isDeleted: false,
    slug: user.slug,
    avatar: user.avatar,
    location: user.location,
    about: user.about,
    cover: user.cover,
    joinedAt: null,
  };
}
