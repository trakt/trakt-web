import { describe, expect, it } from 'vitest';
import { ListTarget } from './models/ListTarget.ts';
import { toListTarget } from './toListTarget.ts';

describe('util: toListTarget', () => {
  it('should map a known source to its target', () => {
    expect(toListTarget('discover')).toBe(ListTarget.Discover);
  });

  it('should drop an unknown source', () => {
    expect(toListTarget('unknown')).toBeUndefined();
  });

  it('should drop a missing source', () => {
    expect(toListTarget(null)).toBeUndefined();
  });
});
