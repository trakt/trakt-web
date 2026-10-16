import { describe, expect, it } from 'vitest';
import { toMixtapeResults } from './toMixtapeResults.ts';

const suggestion = (id: number) => ({ media: { id }, because: 1 });

describe('toMixtapeResults', () => {
  it('should show the first three suggestions', () => {
    const results = toMixtapeResults([1, 2, 3, 4].map(suggestion), []);
    expect(results.map(({ media }) => media.id)).toEqual([1, 2, 3]);
  });

  it('should replace a skipped suggestion with the next one', () => {
    const results = toMixtapeResults([1, 2, 3, 4].map(suggestion), [2]);
    expect(results.map(({ media }) => media.id)).toEqual([1, 3, 4]);
  });

  it('should show fewer than three when the list runs out', () => {
    expect(toMixtapeResults([1].map(suggestion), [])).toHaveLength(1);
  });
});
