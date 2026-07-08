import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { combineLatest, map } from 'rxjs';
import { TV_TIME_ANNOUNCEMENT_DATE } from '../../tv-time/constants/index.ts';
import { useBannerDismissal } from '../../_internal/useBannerDismissal.ts';
import {
  TV_TIME_IMPORT_BANNER_END,
  TV_TIME_IMPORT_BANNER_ID,
  TV_TIME_IMPORT_V2_RELEASE_DATE,
} from '../constants/index.ts';

const DISMISSAL_VALUE = 'dismissed';

// The migration cohort that imported before the v2 importer: joined on/after
// the shutdown announcement but before the v2 release.
function joinedBeforeImportV2(user: UserSettings | undefined): boolean {
  const joinedAt = user?.joinedAt;
  return joinedAt != null &&
    joinedAt >= TV_TIME_ANNOUNCEMENT_DATE &&
    joinedAt < TV_TIME_IMPORT_V2_RELEASE_DATE;
}

export function useTvTimeImportBanner() {
  const { user } = useUser();
  const { isDismissed, dismiss } = useBannerDismissal(
    TV_TIME_IMPORT_BANNER_ID,
    DISMISSAL_VALUE,
  );

  const hasExpired = new Date() >= TV_TIME_IMPORT_BANNER_END;

  const isVisible = combineLatest([user, isDismissed]).pipe(
    map(([$user, $isDismissed]) =>
      !hasExpired && !$isDismissed && joinedBeforeImportV2($user)
    ),
  );

  return { isVisible, dismiss };
}
