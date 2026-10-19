import { describe, expect, it } from 'vitest';
import { toLoadDirection } from './toLoadDirection.ts';

describe('util: toLoadDirection', () => {
  it('should load later weeks below a chronological list', () => {
    expect(toLoadDirection('chronological', 'more')).toBe('later');
    expect(toLoadDirection('chronological', 'previous')).toBe('earlier');
  });

  it('should load earlier weeks below a reverse list', () => {
    expect(toLoadDirection('reverse-chronological', 'more')).toBe('earlier');
    expect(toLoadDirection('reverse-chronological', 'previous')).toBe('later');
  });
});
