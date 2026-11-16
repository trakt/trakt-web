import { describe, expect, it } from 'vitest';
import { parseShareShape } from './parseShareShape.ts';

describe('util: parseShareShape', () => {
  it('should default to a cover image', () => {
    expect(parseShareShape(null)).toEqual({
      shape: 'cover',
      shareType: 'feed',
    });
  });

  it('should map each shape to its share type', () => {
    expect(parseShareShape('story')).toEqual({
      shape: 'story',
      shareType: 'story',
    });
    expect(parseShareShape('og')).toEqual({
      shape: 'og',
      shareType: 'open-graph',
    });
  });

  it('should reject unknown shapes', () => {
    expect(parseShareShape('square')).toBeNull();
    expect(parseShareShape('toString')).toBeNull();
  });
});
