import { describe, expect, it } from 'vitest';
import { toUserName } from './toUserName.ts';

describe('toUserName', () => {
  it('should handle null name', () => {
    const result = toUserName(null);
    expect(result).toEqual({
      full: '',
      first: '',
      last: '',
    });
  });

  it('should handle single name', () => {
    const result = toUserName('simple name');
    expect(result).toEqual({
      full: 'simple name',
      first: 'simple',
      last: 'name',
    });
  });

  it('should handle multi-part name', () => {
    const result = toUserName('Harry Du Bois');
    expect(result).toEqual({
      full: 'Harry Du Bois',
      first: 'Harry',
      last: 'Du Bois',
    });
  });
});
