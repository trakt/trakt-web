import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { UserLimits } from '$lib/requests/models/UserLimits.ts';
import { combineLatest, map } from 'rxjs';
import { useBannerDismissal } from '../../_internal/useBannerDismissal.ts';
import { WELCOME_BANNER_ID } from '../constants/index.ts';

const DISMISSAL_VALUE = 'dismissed';

function hasNoActivity(limits: UserLimits): boolean {
  const metrics = Object.values(limits);
  return metrics.length > 0 && metrics.every((metric) => metric.current === 0);
}

export function useWelcomeBanner() {
  const { limits } = useUser();
  const { isDismissed, dismiss } = useBannerDismissal(
    WELCOME_BANNER_ID,
    DISMISSAL_VALUE,
  );

  const isVisible = combineLatest([limits, isDismissed]).pipe(
    map(([$limits, $isDismissed]) =>
      !$isDismissed && $limits != null && hasNoActivity($limits)
    ),
  );

  return { isVisible, dismiss };
}
