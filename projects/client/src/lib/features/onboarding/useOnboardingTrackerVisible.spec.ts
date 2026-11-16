import { afterEach, describe, expect, it } from 'vitest';
import { onboardingUiStore } from './_internal/onboardingUiStore.ts';
import { useOnboardingTrackerVisible } from './useOnboardingTrackerVisible.ts';

describe('store: useOnboardingTrackerVisible', () => {
  afterEach(() => onboardingUiStore.setTrackerGlyph(null));

  it('should emit false, then true while a glyph is set, then false again', () => {
    const emissions: boolean[] = [];
    const subscription = useOnboardingTrackerVisible().subscribe((visible) =>
      emissions.push(visible),
    );

    onboardingUiStore.setTrackerGlyph(document.createElement('span'));
    onboardingUiStore.setTrackerGlyph(null);
    subscription.unsubscribe();

    expect(emissions).toEqual([false, true, false]);
  });

  it('should not re-emit for repeated identical values', () => {
    const emissions: boolean[] = [];
    const subscription = useOnboardingTrackerVisible().subscribe((visible) =>
      emissions.push(visible),
    );

    onboardingUiStore.setTrackerGlyph(document.createElement('span'));
    onboardingUiStore.setTrackerGlyph(document.createElement('div'));
    onboardingUiStore.setTrackerGlyph(null);
    onboardingUiStore.setTrackerGlyph(null);
    subscription.unsubscribe();

    expect(emissions).toEqual([false, true, false]);
  });
});
