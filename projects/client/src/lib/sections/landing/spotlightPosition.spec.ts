import { describe, expect, it } from 'vitest';
import { spotlightPosition } from './spotlightPosition.ts';

const positionsFor = (active: number, count: number) =>
  Array.from(
    { length: count },
    (_, index) => spotlightPosition({ index, active, count }),
  );

describe('util: spotlightPosition', () => {
  it('should put the active item in front with the next two behind it', () => {
    expect(positionsFor(0, 6)).toEqual([
      'front',
      'next',
      'after',
      'hidden',
      'hidden',
      'leaving',
    ]);
  });

  it('should wrap around the end of the list', () => {
    expect(positionsFor(5, 6)).toEqual([
      'next',
      'after',
      'hidden',
      'hidden',
      'leaving',
      'front',
    ]);
  });

  it('should not mark anything as leaving when every item fits the stack', () => {
    expect(positionsFor(1, 3)).toEqual(['after', 'front', 'next']);
  });

  it('should show a single item in front', () => {
    expect(positionsFor(0, 1)).toEqual(['front']);
  });
});
