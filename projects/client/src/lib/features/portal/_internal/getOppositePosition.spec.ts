import { describe, expect, it } from 'vitest';
import { getOppositePosition } from './getOppositePosition.ts';

describe('getOppositePosition', () => {
  it('should return bottom for top', () => {
    expect(getOppositePosition('top')).toBe('bottom');
  });

  it('should return top for bottom', () => {
    expect(getOppositePosition('bottom')).toBe('top');
  });

  it('should return right for left', () => {
    expect(getOppositePosition('left')).toBe('right');
  });

  it('should return left for right', () => {
    expect(getOppositePosition('right')).toBe('left');
  });
});
