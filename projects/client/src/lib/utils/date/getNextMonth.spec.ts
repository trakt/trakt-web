import { describe, expect, it } from 'vitest';
import { getNextMonth } from './getNextMonth.ts';

describe('getNextMonth', () => {
  it('should return the next month when given a date', () => {
    const result = getNextMonth(new Date('2023-07-15'));

    expect(result.getMonth()).toBe(7);
    expect(result.getFullYear()).toBe(2023);
    expect(result.getDate()).toBe(15);
  });

  it('should roll into January of the next year when given December', () => {
    const result = getNextMonth(new Date('2023-12-10'));

    expect(result.getMonth()).toBe(0);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getDate()).toBe(10);
  });

  it('should not modify the original date object', () => {
    const original = new Date('2023-05-20');

    getNextMonth(original);

    expect(original.getMonth()).toBe(4);
    expect(original.getFullYear()).toBe(2023);
  });
});
