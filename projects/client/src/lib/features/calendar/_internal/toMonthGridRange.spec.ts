import { describe, expect, it } from 'vitest';
import { toMonthGridRange } from './toMonthGridRange.ts';

describe('util: toMonthGridRange', () => {
  it('should cover the month from the start of its first week to the end of its last', () => {
    const { start, days } = toMonthGridRange(new Date(2026, 9, 15), 'en');

    expect(start.toDateString()).toBe('Sun Sep 27 2026');
    expect(days).toBe(35);
  });

  it('should cover six weeks when the month spans them', () => {
    const { start, days } = toMonthGridRange(new Date(2026, 4, 15), 'en');

    expect(start.toDateString()).toBe('Sun Apr 26 2026');
    expect(days).toBe(42);
  });

  it('should follow the month the active week ends in', () => {
    const { reference, start } = toMonthGridRange(new Date(2026, 10, 30), 'en');

    expect(reference.getMonth()).toBe(11);
    expect(start.toDateString()).toBe('Sun Nov 29 2026');
  });

  it('should start on Monday for a Monday-first locale', () => {
    const { start } = toMonthGridRange(new Date(2026, 9, 15), 'nl-NL');

    expect(start.toDateString()).toBe('Mon Sep 28 2026');
  });
});
