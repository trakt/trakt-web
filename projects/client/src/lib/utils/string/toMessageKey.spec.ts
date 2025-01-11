import { describe, expect, it } from 'vitest';
import { toMessageKey } from './toMessageKey.ts';

describe('toMessageKey', () => {
  it('should add a prefix and convert to lowercase', () => {
    expect(toMessageKey('prefix', 'MyVaLuE')).toBe('prefix_myvalue');
  });

  it('should replace spaces with an underscore', () => {
    expect(toMessageKey('prefix', 'my value')).toBe('prefix_my_value');
  });

  it('should replace dashes with an underscore', () => {
    expect(toMessageKey('prefix', 'my-value')).toBe('prefix_my_value');
  });

  it('should replace strip quotes and parenthesis', () => {
    expect(toMessageKey('prefix', "My Value ('or not')")).toBe(
      'prefix_my_value_or_not',
    );
  });
});
