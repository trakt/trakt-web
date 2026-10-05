import { describe, expect, it } from 'vitest';
import { toHumanDateRange } from './toHumanDateRange.ts';

describe('util: toHumanDateRange', () => {
  it('should collapse the shared month', () => {
    const range = toHumanDateRange({
      start: new Date(2026, 9, 1),
      end: new Date(2026, 9, 7),
      locale: 'en',
    });

    expect(range).toMatch(/^October 1\s*.\s*7$/);
  });

  it('should show both months when they differ', () => {
    const range = toHumanDateRange({
      start: new Date(2026, 8, 29),
      end: new Date(2026, 9, 5),
      locale: 'en',
    });

    expect(range).toContain('September 29');
    expect(range).toContain('October 5');
  });
});
