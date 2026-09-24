import { describe, expect, it } from 'vitest';
import { hexToRgba } from './hexToRgba.ts';

describe('util: hexToRgba', () => {
  it('should convert a six digit hex', () => {
    expect(hexToRgba('#00588c', 0.1)).toBe('rgba(0, 88, 140, 0.1)');
  });

  it('should accept a hex without the leading hash', () => {
    expect(hexToRgba('d29d40', 0.5)).toBe('rgba(210, 157, 64, 0.5)');
  });

  it('should be case insensitive', () => {
    expect(hexToRgba('#D29D40', 1)).toBe('rgba(210, 157, 64, 1)');
  });

  it.each(['transparent', '#fff', 'rgb(0, 0, 0)', '', '#zzzzzz'])(
    'should return nothing for %s',
    (value) => {
      expect(hexToRgba(value, 0.1)).toBeUndefined();
    },
  );
});
