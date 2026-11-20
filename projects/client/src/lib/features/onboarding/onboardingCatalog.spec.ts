import { describe, expect, it } from 'vitest';
import { onboardingCatalog } from './onboardingCatalog.ts';

const MAX_STEPS = 5;

describe('onboardingCatalog', () => {
  it('should keep every set at five steps or fewer', () => {
    for (const set of onboardingCatalog) {
      expect(set.steps.length).toBeLessThanOrEqual(MAX_STEPS);
    }
  });

  it('should use unique ids for sets and for steps within a set', () => {
    const setIds = onboardingCatalog.map((set) => set.id);
    expect(new Set(setIds).size).toBe(setIds.length);

    for (const set of onboardingCatalog) {
      const stepIds = set.steps.map((step) => step.id);
      expect(new Set(stepIds).size).toBe(stepIds.length);
    }
  });

  it('should open every set with a step that is done on arrival', () => {
    for (const set of onboardingCatalog) {
      const first = set.steps.at(0);
      expect(first?.skippable).toBe(false);
      expect(first?.completesWith).toBe('always');
    }
  });

  it('should only unlock a set after one listed before it', () => {
    onboardingCatalog.forEach((set, index) => {
      if (!set.unlocksAfter) return;
      const earlier = onboardingCatalog.slice(0, index).map(({ id }) => id);
      expect(earlier).toContain(set.unlocksAfter);
    });
  });
});
