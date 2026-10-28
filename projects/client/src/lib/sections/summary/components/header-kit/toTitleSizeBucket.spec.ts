import { describe, expect, it } from 'vitest';
import { toTitleSizeBucket } from './toTitleSizeBucket.ts';

describe('util: toTitleSizeBucket', () => {
  it('should bucket a short title as large', () => {
    expect(toTitleSizeBucket('Cape Fear')).toBe('large');
  });

  it('should treat 28 characters as the last large title', () => {
    expect(toTitleSizeBucket('a'.repeat(28))).toBe('large');
  });

  it('should bucket 29 characters as medium', () => {
    expect(toTitleSizeBucket('a'.repeat(29))).toBe('medium');
  });

  it('should treat 55 characters as the last medium title', () => {
    expect(toTitleSizeBucket('a'.repeat(55))).toBe('medium');
  });

  it('should bucket 56 characters as small', () => {
    expect(toTitleSizeBucket('a'.repeat(56))).toBe('small');
  });

  it('should bucket the worst-case long title as small', () => {
    const borat =
      'Borat: Cultural Learnings of America for Make Benefit Glorious Nation of Kazakhstan';

    expect(borat.length).toBe(83);
    expect(toTitleSizeBucket(borat)).toBe('small');
  });

  it('should ignore surrounding whitespace when measuring', () => {
    expect(toTitleSizeBucket(`   ${'a'.repeat(28)}   `)).toBe('large');
  });

  it('should bucket an empty title as large', () => {
    expect(toTitleSizeBucket('')).toBe('large');
  });
});
