import { describe, expect, it } from 'vitest';
import { weekStart } from './weekStart.ts';

describe('util: weekStart', () => {
  it('should start the first week on January 1st', () => {
    const date = weekStart(2026, 0);

    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([
      2026,
      0,
      1,
    ]);
  });

  it('should step seven days per week', () => {
    expect(weekStart(2026, 36).getDate()).toBe(10);
    expect(weekStart(2026, 36).getMonth()).toBe(8);
  });
});
