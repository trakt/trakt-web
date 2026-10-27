import { describe, expect, it } from 'vitest';
import { toInitials } from './toInitials.ts';

describe('util: toInitials', () => {
  it('should use the first letter of the first two words', () => {
    expect(toInitials('Dr. Strickland')).toBe('DS');
  });

  it('should cap at two letters', () => {
    expect(toInitials('Mary Jane Watson')).toBe('MJ');
  });

  it('should upper-case a single name', () => {
    expect(toInitials('cobel')).toBe('C');
  });

  it('should keep a whole character when it is outside the basic plane', () => {
    expect(toInitials('\u{1D4D0}lex')).toBe('\u{1D4D0}');
  });

  it('should return nothing for a blank name', () => {
    expect(toInitials('   ')).toBe('');
  });
});
