import { describe, expect, it } from 'vitest';
import { extractItemCount } from './extractItemCount.ts';

describe('util: extractItemCount', () => {
  it('should read the total item count from the header', () => {
    const headers = new Headers({ 'x-pagination-item-count': '42' });
    expect(extractItemCount(headers)).toBe(42);
  });

  it('should fall back to 0 when the header is missing', () => {
    expect(extractItemCount(new Headers())).toBe(0);
  });

  it('should clamp non-numeric and negative values to 0', () => {
    expect(
      extractItemCount(new Headers({ 'x-pagination-item-count': 'abc' })),
    ).toBe(0);
    expect(
      extractItemCount(new Headers({ 'x-pagination-item-count': '-5' })),
    ).toBe(0);
  });
});
