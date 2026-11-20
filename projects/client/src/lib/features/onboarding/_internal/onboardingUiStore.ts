import { BehaviorSubject } from 'rxjs';

const isOpen$ = new BehaviorSubject(false);
const trackerGlyph$ = new BehaviorSubject<Element | null>(null);
const dismissedSetId$ = new BehaviorSubject<string | null>(null);
const openedSetIds$ = new BehaviorSubject<ReadonlySet<string>>(new Set());

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
  openedSetIds: openedSetIds$.asObservable(),
  markOpened: (setId: string) => {
    if (openedSetIds$.value.has(setId)) return;
    openedSetIds$.next(new Set([...openedSetIds$.value, setId]));
  },
};
