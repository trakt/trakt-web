import { describe, expect, it } from 'vitest';
import { mergeNudgeDismissal } from './mergeNudgeDismissal.ts';

describe('mergeNudgeDismissal', () => {
  it('should keep the latest dismissal and the highest count', () => {
    expect(
      mergeNudgeDismissal(
        { dismissedAt: 5, count: 1 },
        { dismissedAt: 3, count: 2 },
      ),
    ).to.deep.equal({ dismissedAt: 5, count: 2 });
  });
});
