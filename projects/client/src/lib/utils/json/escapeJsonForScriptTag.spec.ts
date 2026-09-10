import { describe, expect, it } from 'vitest';
import { escapeJsonForScriptTag } from './escapeJsonForScriptTag.ts';

describe('escapeJsonForScriptTag', () => {
  it('should escape a closing script tag', () => {
    const json = JSON.stringify({ name: 'Heretic</script><img src=x>' });

    const result = escapeJsonForScriptTag(json);

    expect(result).not.toContain('</script>');
    expect(result).not.toContain('<img');
    expect(result).toContain('\\u003c/script\\u003e');
  });

  it('should escape angle brackets', () => {
    expect(escapeJsonForScriptTag('{"a":"<b>"}')).toBe(
      '{"a":"\\u003cb\\u003e"}',
    );
  });

  it('should escape a line separator', () => {
    const json = JSON.stringify({ a: String.fromCharCode(0x2028) });

    expect(escapeJsonForScriptTag(json)).toBe('{"a":"\\u2028"}');
  });

  it('should escape a paragraph separator', () => {
    const json = JSON.stringify({ a: String.fromCharCode(0x2029) });

    expect(escapeJsonForScriptTag(json)).toBe('{"a":"\\u2029"}');
  });

  it('should stay valid json', () => {
    const original = { name: 'a</script>b', overview: '1 < 2 > 0' };

    const result = escapeJsonForScriptTag(JSON.stringify(original));

    expect(JSON.parse(result)).toEqual(original);
  });

  it('should leave json without special characters untouched', () => {
    const json = JSON.stringify({ name: 'Heretic' });

    expect(escapeJsonForScriptTag(json)).toBe(json);
  });
});
