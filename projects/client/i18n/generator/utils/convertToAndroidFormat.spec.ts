/**
 * Tests for convertToAndroidFormat utility function
 */

import { describe, expect, it } from 'vitest';
import { convertToAndroidFormat } from './convertToAndroidFormat.ts';

describe('convertToAndroidFormat', () => {
  it('should convert single string variable to %s (non-positional)', () => {
    expect(convertToAndroidFormat('Hello {name}!')).toBe('Hello %s!');
  });

  it('should convert multiple string variables to positional %s', () => {
    expect(convertToAndroidFormat('Welcome {user} to {app}')).toBe(
      'Welcome %1$s to %2$s',
    );
  });

  it('should convert single number variable to %d (non-positional)', () => {
    const variables = { count: { type: 'number' } };
    expect(convertToAndroidFormat('You have {count} messages', variables)).toBe(
      'You have %d messages',
    );
  });

  it('should convert multiple number variables to positional %d', () => {
    const variables = { total: { type: 'number' }, used: { type: 'number' } };
    expect(convertToAndroidFormat('{total} total, {used} used', variables))
      .toBe(
        '%1$d total, %2$d used',
      );
  });

  it('should handle mixed variable types using positional formatting for multiple variables', () => {
    const variables = {
      name: { type: 'string' },
      count: { type: 'number' },
    };
    const input = 'User {name} has {count} items';
    const expected = 'User %1$s has %2$d items';
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

  it('should handle multiple instances of the same variable with positional formatting', () => {
    const variables = { name: { type: 'string' } };
    expect(convertToAndroidFormat('Hello {name}, welcome {name}!', variables))
      .toBe(
        'Hello %1$s, welcome %2$s!',
      );
  });

  it('should maintain proper position ordering for complex strings', () => {
    const variables = {
      user: { type: 'string' },
      count: { type: 'number' },
      app: { type: 'string' },
    };
    const input = 'Welcome {user}! You have {count} new messages in {app}.';
    const expected = 'Welcome %1$s! You have %2$d new messages in %3$s.';
    expect(convertToAndroidFormat(input, variables)).toBe(expected);
  });
});
