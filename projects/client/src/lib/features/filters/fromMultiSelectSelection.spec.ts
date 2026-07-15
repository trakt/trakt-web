import { describe, expect, it } from 'vitest';
import { fromMultiSelectSelection } from './fromMultiSelectSelection.ts';
import { toMultiSelectSelection } from './toMultiSelectSelection.ts';

describe('util: fromMultiSelectSelection', () => {
  it('should return null for an empty selection', () => {
    expect(fromMultiSelectSelection({ included: [], excluded: [] })).toBeNull();
  });

  it('should join included values without a prefix', () => {
    expect(
      fromMultiSelectSelection({ included: ['action', 'drama'], excluded: [] }),
    ).toBe('action,drama');
  });

  it('should prefix excluded values and append them after included ones', () => {
    expect(
      fromMultiSelectSelection({
        included: ['action'],
        excluded: ['comedy', 'horror'],
      }),
    ).toBe('action,-comedy,-horror');
  });

  it('should round-trip through toMultiSelectSelection', () => {
    const raw = 'action,-comedy,-pg-13';
    expect(fromMultiSelectSelection(toMultiSelectSelection(raw))).toBe(raw);
  });
});
