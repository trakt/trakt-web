import { describe, expect, it } from 'vitest';
import { isSafeHref } from './isSafeHref.ts';

describe('isSafeHref', () => {
  it.each([
    'https://trakt.tv/movies/dune',
    'http://trakt.tv',
    'https://trakt.tv/x?a=1&b=2#fragment',
    'mailto:support@trakt.tv',
    '/movies/dune',
    '#anchor',
    '?query=1',
    '//trakt.tv',
    'relative.html?redirect=a:b',
  ])('isSafeHref should allow %s', (href) => {
    expect(isSafeHref(href)).toBe(true);
  });

  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    '  javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
  ])('isSafeHref should refuse %s', (href) => {
    expect(isSafeHref(href)).toBe(false);
  });

  it.each([
    'java&#115;cript:alert(1)',
    '&#106;avascript:alert(1)',
    '&#x6a;avascript:alert(1)',
    'javascript&colon;alert(1)',
    'java\tscript:alert(1)',
    'java\nscript:alert(1)',
  ])('isSafeHref should refuse %j once the browser decodes it', (href) => {
    expect(isSafeHref(href)).toBe(false);
  });

  it('isSafeHref should decode only once, as a browser does', () => {
    expect(isSafeHref('javascript&amp;colon;alert(1)')).toBe(true);
  });
});
