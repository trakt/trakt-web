import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';

type UserAnalyticsData = {
  user_type: 'anonymous' | 'standard' | 'vip';
};

export function getUserAnalyticsData(user?: UserSettings): UserAnalyticsData {
  // FIXME: figure out testbed issue, and only call this function for authorized users
  if (!user || user.id === 0) {
    return {
      user_type: 'anonymous',
    };
  }

  // No join timestamp: a millisecond-precision date is near-unique per account,
  // which would make it a stable cross-session key.
  return {
    user_type: user.isVip ? 'vip' : 'standard',
  };
}
