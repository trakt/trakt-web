import { describe, expect, it } from 'vitest';
import { escapeHtml } from './escapeHtml.ts';

describe('escapeHtml', () => {
  it('should escape ampersands', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('should escape angle brackets', () => {
    expect(escapeHtml('<b>')).toBe('&lt;b&gt;');
  });

  it('should escape double quotes', () => {
    expect(escapeHtml('say "hi"')).toBe('say &quot;hi&quot;');
  });

  it('should escape single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#39;s');
  });

  it('should escape a script tag payload', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;',
    );
  });

  it('should escape an attribute injection payload', () => {
    expect(escapeHtml('<img src=x onerror="alert(1)">')).toBe(
      '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;',
    );
  });

  it('should leave text without special characters untouched', () => {
    expect(escapeHtml('plain text')).toBe('plain text');
  });

  it('should return an empty string unchanged', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('should escape the ampersand of an existing entity', () => {
    expect(escapeHtml('&amp;')).toBe('&amp;amp;');
  });
});
