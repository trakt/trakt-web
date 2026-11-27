import { describe, expect, it } from 'vitest';
import { toEarlierFilmsLabel } from './toEarlierFilmsLabel.ts';

describe('util: toEarlierFilmsLabel', () => {
  it('should use the singular for one film', () => {
    expect(toEarlierFilmsLabel(1)).toBe('1 earlier film');
  });

  it('should use the plural for several films', () => {
    expect(toEarlierFilmsLabel(3)).toBe('3 earlier films');
  });
});
