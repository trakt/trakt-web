import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';

type UserAnalyticsData = {
  user_type: 'anonymous' | 'standard' | 'vip';
  user_joined_at?: string;
};

export function getUserAnalyticsData(user?: UserSettings): UserAnalyticsData {
  // FIXME: figure out testbed issue, and only call this function for authorized users
  if (!user || user.id === 0) {
    return {
      user_type: 'anonymous',
    };
  }

  return {
    user_type: user.isVip ? 'vip' : 'standard',
    user_joined_at: user.joinedAt?.toISOString(),
  };
}
