import { describe, expect, it } from 'vitest';
import { toOrdinal } from './toOrdinal.ts';

describe('util: toOrdinal', () => {
  it('should format english ordinals', () => {
    expect(
      [1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 96].map((n) => toOrdinal(n)),
    ).to.deep.equal([
      '1st',
      '2nd',
      '3rd',
      '4th',
      '11th',
      '12th',
      '13th',
      '21st',
      '22nd',
      '23rd',
      '96th',
    ]);
  });
});
