import { describe, expect, it } from 'vitest';
import { addYear } from './addYear.ts';

describe('addYear', () => {
  it('should add one year to a regular date', () => {
    const date = new Date('2023-06-15');
    const result = addYear(date, 1);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(date.getMonth());
    expect(result.getDate()).toBe(date.getDate());
  });

  it('should handle leap year to non-leap year transition', () => {
    const date = new Date('2024-02-29');
    const result = addYear(date, 1);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(2); // March
    expect(result.getDate()).toBe(1); // Becomes March 1st
  });

  it('should handle non-leap year to leap year transition', () => {
    const date = new Date('2023-02-28');
    const result = addYear(date, 1);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(28);
  });

  it('should not mutate the original date', () => {
    const originalDate = new Date('2023-06-15');
    const originalYear = originalDate.getFullYear();
    addYear(originalDate, 1);
    expect(originalDate.getFullYear()).toBe(originalYear);
  });

  it('should handle year transition from 1999 to 2000', () => {
    const date = new Date('1999-12-31');
    const result = addYear(date, 1);
    expect(result.getFullYear()).toBe(2000);
    expect(result.getMonth()).toBe(11); // December
    expect(result.getDate()).toBe(31);
  });

  it('should preserve time components', () => {
    const date = new Date('2023-06-15T14:30:45.123Z');
    const result = addYear(date, 1);
    expect(result.getHours()).toBe(date.getHours());
    expect(result.getMinutes()).toBe(date.getMinutes());
    expect(result.getSeconds()).toBe(date.getSeconds());
    expect(result.getMilliseconds()).toBe(date.getMilliseconds());
  });

  it('should handle zero offset', () => {
    const date = new Date('2023-06-15');
    const result = addYear(date, 0);
    expect(result.getFullYear()).toBe(2023);
    expect(result.getMonth()).toBe(date.getMonth());
    expect(result.getDate()).toBe(date.getDate());
  });

  it('should subtract one year', () => {
    const date = new Date('2023-06-15');
    const result = addYear(date, -1);
    expect(result.getFullYear()).toBe(2022);
    expect(result.getMonth()).toBe(date.getMonth());
    expect(result.getDate()).toBe(date.getDate());
  });

  it('should add two years', () => {
    const date = new Date('2023-06-15');
    const result = addYear(date, 2);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(date.getMonth());
    expect(result.getDate()).toBe(date.getDate());
  });

  it('should subtract two years', () => {
    const date = new Date('2023-06-15');
    const result = addYear(date, -2);
    expect(result.getFullYear()).toBe(2021);
    expect(result.getMonth()).toBe(date.getMonth());
    expect(result.getDate()).toBe(date.getDate());
  });

  it('should handle large positive offset', () => {
    const date = new Date('2023-06-15');
    const result = addYear(date, 100);
    expect(result.getFullYear()).toBe(2123);
    expect(result.getMonth()).toBe(date.getMonth());
    expect(result.getDate()).toBe(date.getDate());
  });

  it('should handle large negative offset', () => {
    const date = new Date('2023-06-15');
    const result = addYear(date, -100);
    expect(result.getFullYear()).toBe(1923);
    expect(result.getMonth()).toBe(date.getMonth());
    expect(result.getDate()).toBe(date.getDate());
  });

  it('should handle leap year with negative offset', () => {
    const date = new Date('2024-02-29');
    const result = addYear(date, -1);
    expect(result.getFullYear()).toBe(2023);
    expect(result.getMonth()).toBe(2); // March
    expect(result.getDate()).toBe(1);
  });

  it('should handle non-leap year with positive offset to leap year', () => {
    const date = new Date('2023-02-28');
    const result = addYear(date, 2);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(28);
  });
});
