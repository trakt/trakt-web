import { describe, expect, it } from 'vitest';
import { pickRandom } from './pickRandom.ts';

describe('util: pickRandom', () => {
  it('should pick the item at the random position', () => {
    expect(pickRandom(['a', 'b', 'c'], () => 0)).toBe('a');
    expect(pickRandom(['a', 'b', 'c'], () => 0.5)).toBe('b');
    expect(pickRandom(['a', 'b', 'c'], () => 0.99)).toBe('c');
  });

  it('should return undefined for an empty list', () => {
    expect(pickRandom([], () => 0)).toBeUndefined();
  });
});
