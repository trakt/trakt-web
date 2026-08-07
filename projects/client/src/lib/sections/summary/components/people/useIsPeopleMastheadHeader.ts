import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';

/**
 * Whether the person page's masthead header is active.
 *
 * The route needs this, not just the header: the masthead is a full-bleed
 * composition that has to start high on the page, and the person route otherwise
 * asks for the full navbar, which is taller than the minimal one the movie and
 * show pages use. That extra height was the whole reason the person masthead sat
 * lower than the media one - nothing inside the header could have corrected it.
 */
export function useIsPeopleMastheadHeader() {
  const { isEnabled } = useFeatureFlag();

  return isEnabled(FeatureFlag.PeopleHeaderMasthead);
}
