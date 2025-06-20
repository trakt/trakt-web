/**
 * Tests for convertToAndroidFormat utility function
 */

import { describe, expect, it } from 'vitest';
import { convertToAndroidFormat } from './convertToAndroidFormat.ts';

describe('convertToAndroidFormat', () => {
  it('should convert simple string variables to %s', () => {
    expect(convertToAndroidFormat('Hello {name}!')).toBe('Hello %s!');
    expect(convertToAndroidFormat('Welcome {user} to {app}')).toBe(
      'Welcome %s to %s',
    );
  });

  it('should convert number variables to %d using variables metadata', () => {
    const variables = { count: { type: 'number' } };
    expect(convertToAndroidFormat('You have {count} messages', variables)).toBe(
      'You have %d messages',
    );

    const variables2 = { total: { type: 'number' } };
    expect(convertToAndroidFormat('{total} items selected', variables2)).toBe(
      '%d items selected',
    );
  });

  it('should handle mixed variable types using variables metadata', () => {
    const variables = {
      name: { type: 'string' },
      count: { type: 'number' },
    };
    const input = 'User {name} has {count} items';
    const expected = 'User %s has %d items';
    expect(convertToAndroidFormat(input, variables)).toBe(expected);
  });

  it('should handle text without variables', () => {
    expect(convertToAndroidFormat('Simple text')).toBe('Simple text');
    expect(convertToAndroidFormat('')).toBe('');
  });

  it('should default to string format when no variables metadata is provided', () => {
    expect(convertToAndroidFormat('Hello {name}')).toBe('Hello %s');
    expect(convertToAndroidFormat('You have {count} items')).toBe(
      'You have %s items',
    );
  });
});
