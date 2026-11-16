import { BehaviorSubject } from 'rxjs';

const isOpen$ = new BehaviorSubject(false);
const trackerGlyph$ = new BehaviorSubject<Element | null>(null);
const dismissedSetId$ = new BehaviorSubject<string | null>(null);

export const onboardingUiStore = {
  isOpen: isOpen$.asObservable(),
  open: () => isOpen$.next(true),
  close: () => isOpen$.next(false),
  trackerGlyph: trackerGlyph$.asObservable(),
  setTrackerGlyph: (element: Element | null) => trackerGlyph$.next(element),
  dismissedSetId: dismissedSetId$.asObservable(),
  dismiss: (setId: string) => {
    isOpen$.next(false);
    dismissedSetId$.next(setId);
  },
};
