/**
 * Tests for convertToIOSFormat utility function
 */

import { describe, expect, it } from 'vitest';
import { convertToIOSFormat } from './convertToIOSFormat.ts';

describe('convertToIOSFormat', () => {
  it('should convert simple string variables to %@', () => {
    expect(convertToIOSFormat('Hello {name}!')).toBe('Hello %@!');
    expect(convertToIOSFormat('Welcome {user} to {app}')).toBe(
      'Welcome %@ to %@',
    );
  });

  it('should convert number variables to %d using variables metadata', () => {
    const variables = { count: { type: 'number' } };
    expect(convertToIOSFormat('You have {count} messages', variables)).toBe(
      'You have %d messages',
    );

    const variables2 = { total: { type: 'number' } };
    expect(convertToIOSFormat('{total} items selected', variables2)).toBe(
      '%d items selected',
    );
  });

  it('should handle mixed variable types using variables metadata', () => {
    const variables = {
      name: { type: 'string' },
      count: { type: 'number' },
    };
    const input = 'User {name} has {count} items';
    const expected = 'User %@ has %d items';
    expect(convertToIOSFormat(input, variables)).toBe(expected);
  });

  it('should handle text without variables', () => {
    expect(convertToIOSFormat('Simple text')).toBe('Simple text');
    expect(convertToIOSFormat('')).toBe('');
  });

  it('should default to string format when no variables metadata is provided', () => {
    expect(convertToIOSFormat('Hello {name}')).toBe('Hello %@');
    expect(convertToIOSFormat('You have {count} items')).toBe(
      'You have %@ items',
    );
  });
});
