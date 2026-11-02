import { describe, expect, it } from 'vitest';
import { toCarouselOffset } from './toCarouselOffset.ts';

describe('toCarouselOffset', () => {
  it('should put the selected card in the centre', () => {
    expect(toCarouselOffset({ index: 1, selected: 1, count: 3 })).toBe(0);
  });

  it('should keep the neighbours either side of the selection', () => {
    expect(toCarouselOffset({ index: 0, selected: 1, count: 3 })).toBe(-1);
    expect(toCarouselOffset({ index: 2, selected: 1, count: 3 })).toBe(1);
  });

  it('should wrap the far card round to the other side', () => {
    expect(toCarouselOffset({ index: 2, selected: 0, count: 3 })).toBe(-1);
    expect(toCarouselOffset({ index: 0, selected: 2, count: 3 })).toBe(1);
  });

  it('should handle a single card and no cards', () => {
    expect(toCarouselOffset({ index: 0, selected: 0, count: 1 })).toBe(0);
    expect(toCarouselOffset({ index: 0, selected: 0, count: 0 })).toBe(0);
  });
});
