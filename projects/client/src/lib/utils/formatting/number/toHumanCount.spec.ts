import { describe, expect, it } from 'vitest';
import { toHumanCount } from './toHumanCount.ts';

describe('toHumanCount', () => {
  it('will format 42 as 42', () => {
    expect(toHumanCount(42)).toBe('42');
  });

  it('will format 4217 as the grouped number 4,217', () => {
    expect(toHumanCount(4217)).toBe('4,217');
  });

  it('will format 99999 as the grouped number 99,999', () => {
    expect(toHumanCount(99999)).toBe('99,999');
  });

  it('will format 100000 as the compact number 100K', () => {
    expect(toHumanCount(100000)).toBe('100K');
  });

  it('will format 4217000 as the compact number 4.2M', () => {
    expect(toHumanCount(4217000)).toBe('4.2M');
  });

  it('will format -4217 as the grouped number -4,217', () => {
    expect(toHumanCount(-4217)).toBe('-4,217');
  });

  it('will respect the provided locale', () => {
    expect(toHumanCount(4217, 'de')).toBe('4.217');
  });
});
