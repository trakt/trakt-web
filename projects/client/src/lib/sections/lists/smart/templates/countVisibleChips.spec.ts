import { describe, expect, it } from 'vitest';
import { countVisibleChips } from './countVisibleChips.ts';

const base = { gap: 4, maxRows: 2, moreWidth: 30 };

describe('util: countVisibleChips', () => {
  it('should show every chip that fits in two rows', () => {
    expect(
      countVisibleChips({ ...base, widths: [100, 100, 100], available: 210 }),
    ).toBe(3);
  });

  it('should leave room for the more chip', () => {
    expect(
      countVisibleChips({
        ...base,
        widths: [100, 100, 100, 100, 100],
        available: 210,
      }),
    ).toBe(3);
  });

  it('should drop another chip when the more chip would start a third row', () => {
    expect(
      countVisibleChips({
        ...base,
        widths: [100, 100, 100, 100, 100],
        available: 204,
      }),
    ).toBe(3);
  });

  it('should clamp a chip wider than the row', () => {
    expect(
      countVisibleChips({ ...base, widths: [500, 500], available: 200 }),
    ).toBe(2);
  });

  it('should show nothing when no chip fits next to the more chip', () => {
    expect(
      countVisibleChips({ ...base, widths: [200, 200, 200], available: 200 }),
    ).toBe(1);
  });

  it('should handle no chips', () => {
    expect(countVisibleChips({ ...base, widths: [], available: 200 })).toBe(0);
  });
});
