import type { DatePart } from '$lib/models/DatePart.ts';
import { describe, expect, it } from 'vitest';
import { buildLocalDate } from './buildLocalDate.ts';

describe('buildLocalDate', () => {
  it('should build a date with year, month, and day', () => {
    const parts: DatePart = { year: 2023, month: 1, day: 15 };
    const result = buildLocalDate(parts);
    expect(result.getFullYear()).toBe(2023);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(15);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });

  it('should build a date with optional hour, minute, and second', () => {
    const parts: DatePart = {
      year: 2023,
      month: 6,
      day: 10,
      hour: 14,
      minute: 30,
      second: 45,
    };
    const result = buildLocalDate(parts);
    expect(result.getFullYear()).toBe(2023);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(10);
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(30);
    expect(result.getSeconds()).toBe(45);
  });

  it('should default hour, minute, and second to 0 when not provided', () => {
    const parts: DatePart = { year: 2022, month: 12, day: 25 };
    const result = buildLocalDate(parts);
    expect(result.getFullYear()).toBe(2022);
    expect(result.getMonth()).toBe(11);
    expect(result.getDate()).toBe(25);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });

  it('should handle leap year dates correctly', () => {
    const parts: DatePart = { year: 2024, month: 2, day: 29 };
    const result = buildLocalDate(parts);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(29);
  });

  it('should handle month input (1-based)', () => {
    const parts: DatePart = { year: 2023, month: 1, day: 1 }; // January
    const result = buildLocalDate(parts);
    expect(result.getMonth()).toBe(0); // JavaScript months are 0-based
  });

  it('should build date for end of month', () => {
    const parts: DatePart = { year: 2023, month: 1, day: 31 }; // January 31
    const result = buildLocalDate(parts);
    expect(result.getFullYear()).toBe(2023);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(31);
  });

  it('should handle midnight time', () => {
    const parts: DatePart = {
      year: 2023,
      month: 7,
      day: 4,
      hour: 0,
      minute: 0,
      second: 0,
    };
    const result = buildLocalDate(parts);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });

  it('should handle noon time', () => {
    const parts: DatePart = {
      year: 2023,
      month: 7,
      day: 4,
      hour: 12,
      minute: 0,
      second: 0,
    };
    const result = buildLocalDate(parts);
    expect(result.getHours()).toBe(12);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });
});
