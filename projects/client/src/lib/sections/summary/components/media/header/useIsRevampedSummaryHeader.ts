import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { combineLatest, map } from 'rxjs';

/**
 * Whether either revamped summary header is active.
 *
 * Pages need this because the revamped headers surface content that also exists
 * as a section further down the page - trivia most obviously. Without it a title
 * showed its trivia twice: once in the header, once at the foot.
 *
 * The header itself cannot suppress those sections; they are its siblings, not
 * its children. So the decision has to be readable from the page too, and this is
 * the one place that knows it.
 */
export function useIsRevampedSummaryHeader() {
  const { isEnabled } = useFeatureFlag();

  return combineLatest([
    isEnabled(FeatureFlag.SummaryHeaderAnchored),
    isEnabled(FeatureFlag.SummaryHeaderMasthead),
  ]).pipe(
    map(([isAnchored, isMasthead]) => isAnchored || isMasthead),
  );
}
