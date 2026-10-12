import { describe, expect, it } from 'vitest';
import { fromLegacyReelSeen } from './fromLegacyReelSeen.ts';

describe('fromLegacyReelSeen', () => {
  it('should turn the seen years into a map by year', () => {
    expect(fromLegacyReelSeen([2025, 2026, 'x'])).to.deep.equal({
      '2025': true,
      '2026': true,
    });
  });

  it('should ignore values that are not a list', () => {
    expect(fromLegacyReelSeen({ 2026: true })).to.equal(null);
  });
});
