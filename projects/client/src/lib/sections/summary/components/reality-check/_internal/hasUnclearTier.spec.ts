import { describe, expect, it } from 'vitest';
import { hasUnclearTier } from './hasUnclearTier.ts';

describe('util: hasUnclearTier', () => {
  it('should be true when the story is unclear', () => {
    expect(hasUnclearTier({ story: 'unclear', protagonists: [] })).to.equal(
      true,
    );
  });

  it('should be true when a protagonist is unclear', () => {
    expect(
      hasUnclearTier({
        story: 'loose',
        protagonists: [{ name: 'Ada', tier: 'unclear' }],
      }),
    ).to.equal(true);
  });

  it('should be false when every tier is graded', () => {
    expect(
      hasUnclearTier({
        story: 'loose',
        protagonists: [{ name: 'Ada', tier: 'faithful' }],
      }),
    ).to.equal(false);
  });
});
