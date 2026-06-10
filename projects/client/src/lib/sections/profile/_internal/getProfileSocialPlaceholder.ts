import * as m from '$lib/features/i18n/messages.ts';
import type { ProfileSocialListType } from '../models/ProfileSocialListType.ts';

export function getProfileSocialPlaceholder(
  type: ProfileSocialListType,
): string {
  if (type === 'following') return m.list_placeholder_following();
  if (type === 'followers') return m.list_placeholder_followers();
  return m.list_placeholder_follow_requests();
}
