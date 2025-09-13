import { describe, expect, it } from 'vitest';
import { toHumanDay } from './toHumanDay.ts';

describe('toHumanDay', () => {
  it('will display September 19th, 2023', () => {
    const day = new Date('2023-09-19');

    expect(toHumanDay(day, 'en')).toBe('September 19th, 2023');
  });

  it('will display 19 september 2023', () => {
    const day = new Date('2023-09-19');

    expect(toHumanDay(day, 'nl-nl')).toBe('19 september 2023');
  });

  it('will display the day only', () => {
    const day = new Date('December 17, 1995 03:24:00');

    expect(toHumanDay(day, 'en')).toBe('December 17th, 1995');
  });

  it('will display September 19th, 2023', () => {
    const day = new Date('2023-09-19');

    expect(toHumanDay(day, 'en', 'short')).toBe('Sep 19, 2023');
  });
});
