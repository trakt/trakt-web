import { page } from '$app/state';
import { useToggler } from '$lib/components/toggles/useToggler.ts';
import type { RelatedMode } from '$lib/requests/models/RelatedMode.ts';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import { AnalyticsEvent } from '../analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../analytics/useTrack.ts';
import { useUser } from '../auth/stores/useUser.ts';
import { FeatureFlag } from '../feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '../feature-flag/useFeatureFlag.ts';

export function useRelatedMode() {
  const { options, set, current } = useToggler('relatedMode');
  const { user } = useUser();
  const { isEnabled } = useFeatureFlag();
  const { track } = useTrack(AnalyticsEvent.RelatedMode);

  const isPersonalized = combineLatest([
    user,
    isEnabled(FeatureFlag.PersonalizedRelated),
    current,
  ]).pipe(
    map(
      ([$user, $isEnabled, $current]) =>
        $isEnabled && $user.isDirector && $current.value === 'personal',
    ),
    distinctUntilChanged(),
  );

  const onModeChange = (value: RelatedMode) => {
    track({ mode: value, source: page.route.id ?? 'unknown' });
    set(value);
  };

  return {
    options,
    current,
    isPersonalized,
    onModeChange,
  };
}
