import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { combineLatest, map } from 'rxjs';
import { useBannerDismissal } from '../../_internal/useBannerDismissal.ts';
import {
  TV_TIME_ANNOUNCEMENT_DATE,
  TV_TIME_BANNER_END,
  TV_TIME_BANNER_ID,
} from '../constants/index.ts';

const DISMISSAL_VALUE = 'dismissed';

function joinedAfterAnnouncement(user: UserSettings | undefined): boolean {
  const joinedAt = user?.joinedAt;
  return joinedAt != null && joinedAt >= TV_TIME_ANNOUNCEMENT_DATE;
}

export function useTvTimeBanner() {
  const { user } = useUser();
  const { isDismissed, dismiss } = useBannerDismissal(
    TV_TIME_BANNER_ID,
    DISMISSAL_VALUE,
  );

  const hasExpired = new Date() >= TV_TIME_BANNER_END;

  const isVisible = combineLatest([user, isDismissed]).pipe(
    map(([$user, $isDismissed]) =>
      !hasExpired && !$isDismissed && joinedAfterAnnouncement($user)
    ),
  );

  return { isVisible, dismiss };
}
