import { distinctUntilChanged, map, type Observable } from 'rxjs';
import { onboardingUiStore } from './_internal/onboardingUiStore.ts';

export function useOnboardingTrackerVisible(): Observable<boolean> {
  return onboardingUiStore.trackerGlyph.pipe(
    map((element) => element !== null),
    distinctUntilChanged(),
  );
}
