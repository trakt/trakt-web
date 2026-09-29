import { describe, expect, it } from 'vitest';
import { toPersonaStat } from './toPersonaStat.ts';

describe('util: toPersonaStat', () => {
  it('should group plain counts', () => {
    expect(toPersonaStat({ kind: 'anime-episodes', value: 2453 })).toEqual({
      key: 'anime-episodes',
      value: '2,453',
      label: 'anime episodes',
    });
  });

  it('should suffix shares with a percent sign', () => {
    expect(toPersonaStat({ kind: 'anime-share', value: 97 }).value).toBe(
      '97%',
    );
  });

  it('should keep one decimal for decimal kinds', () => {
    expect(toPersonaStat({ kind: 'avg-rating', value: 7.24 }).value).toBe(
      '7.2',
    );
  });

  it('should not group years', () => {
    expect(toPersonaStat({ kind: 'avg-vintage', value: 2007 }).value).toBe(
      '2007',
    );
  });
});
