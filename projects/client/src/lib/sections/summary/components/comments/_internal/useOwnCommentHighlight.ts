import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import { combineLatest, map } from 'rxjs';

export function useOwnCommentHighlight() {
  const { user } = useUser();
  const { isEnabled } = useFeatureFlag();

  const highlightedUserId = combineLatest([
    user,
    isEnabled(FeatureFlag.ReviewsHighlightMine),
  ]).pipe(
    map(([$user, isHighlightEnabled]) =>
      isHighlightEnabled ? $user.id : null,
    ),
  );

  return { highlightedUserId };
}
