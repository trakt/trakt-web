import { describe, expect, test } from 'vitest';
import { unixToDate } from './unixToDate.ts';

describe('util -> date -> unixToDateString', () => {
  test('should return null for null input', () => {
    expect(unixToDate(null)).toBe(null);
  });

  test('should return null for undefined input', () => {
    expect(unixToDate(undefined)).toBe(null);
  });

  test('should return null for NaN input', () => {
    expect(unixToDate(NaN)).toBe(null);
  });

  test('should return the epoch date for zero', () => {
    expect(unixToDate(0)).toBe('1970-01-01');
  });

  test('should parse dates before 1970', () => {
    expect(unixToDate(-1)).toBe('1969-12-31');
    expect(unixToDate(-1000000)).toBe('1969-12-20');
  });

  test('should return correct date string for valid unix timestamp', () => {
    expect(unixToDate(1609459200)).toBe('2021-01-01');
    expect(unixToDate(1640995200)).toBe('2022-01-01');
  });

  test('should handle large valid unix timestamps', () => {
    expect(unixToDate(2147483647)).toBe('2038-01-19');
  });

  test('should return correct date string for float unix timestamps', () => {
    expect(unixToDate(1609459200.5)).toBe('2021-01-01');
  });
});
