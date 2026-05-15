import { describe, expect, it } from 'vitest';
import { groupByPolyfill } from './mapGroupBy.ts';

describe('groupByPolyfill', () => {
  it('groups items by key', () => {
    const items = [
      { source: 'netflix', label: 'a' },
      { source: 'hbo', label: 'b' },
      { source: 'netflix', label: 'c' },
    ];

    const grouped = groupByPolyfill(items, (item) => item.source);

    expect(grouped.get('netflix')).toEqual([
      { source: 'netflix', label: 'a' },
      { source: 'netflix', label: 'c' },
    ]);
    expect(grouped.get('hbo')).toEqual([{ source: 'hbo', label: 'b' }]);
  });

  it('passes index to the key function', () => {
    const indices: number[] = [];

    groupByPolyfill(['a', 'b', 'c'], (_item, index) => {
      indices.push(index);
      return index;
    });

    expect(indices).toEqual([0, 1, 2]);
  });
});
