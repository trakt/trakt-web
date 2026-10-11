import { describe, expect, it } from 'vitest';
import { computeRangeSelection } from './computeRangeSelection.ts';

describe('util: computeRangeSelection', () => {
  const order = ['a', 'b', 'c', 'd', 'e'];

  it('should return every key between the anchor and the target, inclusive', () => {
    expect(computeRangeSelection({ order, anchorKey: 'b', targetKey: 'd' }))
      .to.deep.equal(['b', 'c', 'd']);
  });

  it('should return the range in rendered order when the target is before the anchor', () => {
    expect(computeRangeSelection({ order, anchorKey: 'd', targetKey: 'b' }))
      .to.deep.equal(['b', 'c', 'd']);
  });

  it('should return just the target when there is no anchor', () => {
    expect(computeRangeSelection({ order, anchorKey: null, targetKey: 'c' }))
      .to.deep.equal(['c']);
  });

  it('should return just the target when the anchor is no longer in the order', () => {
    expect(
      computeRangeSelection({ order, anchorKey: 'gone', targetKey: 'c' }),
    ).to.deep.equal(['c']);
  });

  it('should return a single-item range when anchor and target are the same', () => {
    expect(computeRangeSelection({ order, anchorKey: 'c', targetKey: 'c' }))
      .to.deep.equal(['c']);
  });
});
