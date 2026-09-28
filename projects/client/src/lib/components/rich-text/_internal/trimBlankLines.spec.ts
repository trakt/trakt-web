import { describe, expect, it } from 'vitest';
import { trimBlankLines } from './trimBlankLines.ts';

describe('util: trimBlankLines', () => {
  it.each([
    ['trailing empty paragraphs', 'hello\n\n\n\n&nbsp;', 'hello'],
    ['leading empty paragraphs', '&nbsp;\n\n\n\nhello', 'hello'],
    ['surrounding whitespace', '\n\nhello  \n', 'hello'],
    ['only empty paragraphs', '\n\n&nbsp;\n\n&nbsp;', ''],
  ])('should trim %s', (_, markdown, expected) => {
    expect(trimBlankLines(markdown)).toBe(expected);
  });

  it('should keep empty paragraphs between content', () => {
    expect(trimBlankLines('a\n\n&nbsp;\n\nb')).toBe('a\n\n&nbsp;\n\nb');
  });

  it('should keep an escaped nbsp typed by the user', () => {
    expect(trimBlankLines('a &amp;nbsp;')).toBe('a &amp;nbsp;');
  });
});
