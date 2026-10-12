import { describe, expect, it } from 'vitest';
import { fromLegacyNudgeDismissals } from './fromLegacyNudgeDismissals.ts';

describe('fromLegacyNudgeDismissals', () => {
  it("should keep only the user's entries without the user prefix", () => {
    expect(
      fromLegacyNudgeDismissals(
        {
          '42/pill': { dismissedAt: 1, count: 1 },
          '7/bar': { dismissedAt: 2, count: 1 },
        },
        42,
      ),
    ).to.deep.equal({ pill: { dismissedAt: 1, count: 1 } });
  });

  it('should ignore values that are not a map', () => {
    expect(fromLegacyNudgeDismissals(null, 42)).to.equal(null);
    expect(fromLegacyNudgeDismissals('pill', 42)).to.equal(null);
  });
});
