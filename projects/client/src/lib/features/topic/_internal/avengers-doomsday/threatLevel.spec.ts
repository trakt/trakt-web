import { describe, expect, it } from 'vitest';
import { threatLevel } from './threatLevel.ts';

describe('util: threatLevel', () => {
  it.each([
    ['new-premiere', 5],
    ['premiere', 4],
    ['new-finale', 4],
    ['finale', 3],
    ['new', 2],
  ])('should map %s to level %i', (status, level) => {
    expect(threatLevel(status)).toBe(level);
  });

  it('should return nothing for an unknown status', () => {
    expect(threatLevel('watched')).toBeUndefined();
  });

  it('should return nothing for an empty status', () => {
    expect(threatLevel('')).toBeUndefined();
  });
});
