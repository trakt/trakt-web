/**
 * Tests for escapeIOS utility function
 */

import { describe, expect, it } from 'vitest';
import { escapeIOS } from './escapeIOS.ts';

describe('escapeIOS', () => {
  it('should escape backslashes', () => {
    expect(escapeIOS('\\')).toBe('\\\\');
    expect(escapeIOS('path\\to\\file')).toBe('path\\\\to\\\\file');
  });

  it('should escape double quotes', () => {
    expect(escapeIOS('"')).toBe('\\"');
    expect(escapeIOS('Say "hello"')).toBe('Say \\"hello\\"');
  });

  it('should escape newlines', () => {
    expect(escapeIOS('\n')).toBe('\\n');
    expect(escapeIOS('Line 1\nLine 2')).toBe('Line 1\\nLine 2');
  });

  it('should escape tabs', () => {
    expect(escapeIOS('\t')).toBe('\\t');
    expect(escapeIOS('Column 1\tColumn 2')).toBe('Column 1\\tColumn 2');
  });

  it('should handle multiple escape sequences', () => {
    const input = 'Text with "quotes" and \n newlines \t tabs \\ backslashes';
    const expected =
      'Text with \\"quotes\\" and \\n newlines \\t tabs \\\\ backslashes';
    expect(escapeIOS(input)).toBe(expected);
  });

  it('should handle empty and simple strings', () => {
    expect(escapeIOS('')).toBe('');
    expect(escapeIOS('Simple text')).toBe('Simple text');
    expect(escapeIOS('Text without special chars')).toBe(
      'Text without special chars',
    );
  });

  it('should maintain order of replacement for edge cases', () => {
    // Test that backslashes are escaped first (important for proper escaping)
    expect(escapeIOS('\\n')).toBe('\\\\n');
    expect(escapeIOS('\\\\')).toBe('\\\\\\\\');
  });
});
