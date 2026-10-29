import { describe, expect, it } from 'vitest';
import { toHumanCompactDate } from './toHumanCompactDate.ts';

describe('toHumanCompactDate', () => {
  it('should display a relative date within the relative range', () => {
    const today = new Date(2026, 10, 12);
    const yesterday = new Date(2026, 10, 11);

    expect(toHumanCompactDate(today, yesterday, 'en')).toBe(
      'yesterday at 12:00 AM',
    );
  });

  it('should display a short month outside the relative range', () => {
    const today = new Date(2026, 10, 12);
    const date = new Date(2026, 10, 4, 12, 52);

    expect(toHumanCompactDate(today, date, 'en')).toBe('Nov 4, 2026, 12:52 PM');
  });
});
