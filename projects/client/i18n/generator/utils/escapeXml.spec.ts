/**
 * Tests for escapeXml utility function
 */

import { describe, expect, it } from 'vitest';
import { escapeXml } from './escapeXml.ts';

describe('escapeXml', () => {
  it('should escape basic XML characters', () => {
    expect(escapeXml('&')).toBe('&amp;');
    expect(escapeXml('<')).toBe('&lt;');
    expect(escapeXml('>')).toBe('&gt;');
    expect(escapeXml('"')).toBe('\\"');
    expect(escapeXml("'")).toBe("\\'");
  });

  it('should escape multiple characters in sequence', () => {
    expect(escapeXml('&lt;tag&gt;')).toBe('&amp;lt;tag&amp;gt;');
    expect(escapeXml('<tag attr="value">')).toBe(
      '&lt;tag attr=\\"value\\"&gt;',
    );
  });

  it('should handle complex text with mixed special characters', () => {
    const input = `Text with "quotes" & <tags> and 'apostrophes'`;
    const expected =
      "Text with \\\"quotes\\\" &amp; &lt;tags&gt; and \\'apostrophes\\'";
    expect(escapeXml(input)).toBe(expected);
  });

  it('should handle empty and simple strings', () => {
    expect(escapeXml('')).toBe('');
    expect(escapeXml('Simple text')).toBe('Simple text');
    expect(escapeXml('Text without special chars')).toBe(
      'Text without special chars',
    );
  });

  it('should maintain order of replacement for edge cases', () => {
    // Test that & is replaced first (important for proper escaping)
    expect(escapeXml('&lt;')).toBe('&amp;lt;');
    expect(escapeXml('&amp;')).toBe('&amp;amp;');
  });
});
