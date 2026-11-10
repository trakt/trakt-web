import { describe, expect, it } from 'vitest';
import { toCareerStart } from './toCareerStart.ts';

describe('util: toCareerStart', () => {
  it('should return undefined without credits', () => {
    expect(toCareerStart([undefined, new Map()])).to.equal(undefined);
  });
});
