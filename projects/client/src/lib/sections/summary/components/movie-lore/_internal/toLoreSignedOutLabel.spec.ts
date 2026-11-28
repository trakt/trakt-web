import { describe, expect, it } from 'vitest';
import { toLoreSignedOutLabel } from './toLoreSignedOutLabel.ts';

describe('util: toLoreSignedOutLabel', () => {
  it('should count the must-watch and optional films', () => {
    expect(toLoreSignedOutLabel({ mustWatchCount: 3, optionalCount: 2 })).toBe(
      '3 must-watch films, 2 optional',
    );
  });

  it('should use the singular for one must-watch film', () => {
    expect(toLoreSignedOutLabel({ mustWatchCount: 1, optionalCount: 4 })).toBe(
      '1 must-watch film, 4 optional',
    );
  });

  it('should say there is no must-watch film', () => {
    expect(toLoreSignedOutLabel({ mustWatchCount: 0, optionalCount: 2 })).toBe(
      'No must-watch films, 2 optional',
    );
  });
});
