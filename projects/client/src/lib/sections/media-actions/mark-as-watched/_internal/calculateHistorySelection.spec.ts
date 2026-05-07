import { describe, expect, it } from 'vitest';
import { calculateHistorySelection } from './calculateHistorySelection.ts';

describe('calculateHistorySelection', () => {
  it('returns the midpoint as the selected date', () => {
    const start = new Date('2024-01-01T00:00:00.000Z');
    const end = new Date('2024-01-03T00:00:00.000Z');
    expect(calculateHistorySelection(start, end).date).toEqual(
      new Date('2024-01-02T00:00:00.000Z'),
    );
  });

  it('sets minDate and maxDate to the earlier and later date', () => {
    const start = new Date('2024-06-01T00:00:00.000Z');
    const end = new Date('2024-06-10T00:00:00.000Z');
    const { bounds } = calculateHistorySelection(start, end);
    expect(bounds.minDate).toEqual(start);
    expect(bounds.maxDate).toEqual(end);
  });

  it('handles reversed date order', () => {
    const start = new Date('2024-06-10T00:00:00.000Z');
    const end = new Date('2024-06-01T00:00:00.000Z');
    const { bounds } = calculateHistorySelection(start, end);
    expect(bounds.minDate).toEqual(end);
    expect(bounds.maxDate).toEqual(start);
  });

  it('handles equal dates (zero-width range)', () => {
    const date = new Date('2024-01-01T00:00:00.000Z');
    const result = calculateHistorySelection(date, date);
    expect(result.date).toEqual(date);
    expect(result.bounds.minDate).toEqual(date);
    expect(result.bounds.maxDate).toEqual(date);
  });
});
