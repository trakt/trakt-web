import { describe, expect, it } from 'vitest';
import { hasSafeUrlProtocol } from './hasSafeUrlProtocol.ts';

const TAB = 9;
const LINE_FEED = 10;
const CARRIAGE_RETURN = 13;
const NULL_CHARACTER = 0;
const SPACE = 32;

const itRejects = (urls: ReadonlyArray<string>) =>
  urls.forEach((url) => {
    it(`should reject ${JSON.stringify(url)}`, () => {
      expect(hasSafeUrlProtocol(url)).toBe(false);
    });
  });

const itAllows = (urls: ReadonlyArray<string>) =>
  urls.forEach((url) => {
    it(`should allow ${JSON.stringify(url)}`, () => {
      expect(hasSafeUrlProtocol(url)).toBe(true);
    });
  });

describe('hasSafeUrlProtocol', () => {
  describe('unsafe protocols', () => {
    const unsafe = [
      'javascript:alert(1)', // skipcq: JS-0087
      'JaVaScRiPt:alert(1)', // skipcq: JS-0087
      'JAVASCRIPT:alert(1)', // skipcq: JS-0087
      'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox(1)',
      'file:///etc/passwd',
      'blob:https://trakt.tv/abc',
      'ftp://trakt.tv/x',
    ];

    itRejects(unsafe);
  });

  describe('control character obfuscation', () => {
    const codes = [TAB, LINE_FEED, CARRIAGE_RETURN, NULL_CHARACTER, SPACE];

    codes.forEach((code) => {
      it(`should reject a scheme split by char code ${code}`, () => {
        const url = `java${String.fromCharCode(code)}script:alert(1)`;
        expect(hasSafeUrlProtocol(url)).toBe(false);
      });

      it(`should reject a scheme prefixed by char code ${code}`, () => {
        const url = `${String.fromCharCode(code)}javascript:alert(1)`;
        expect(hasSafeUrlProtocol(url)).toBe(false);
      });
    });
  });

  describe('html entity encoded protocols', () => {
    const encoded = [
      '&#106;avascript:alert(1)',
      '&#x6a;avascript:alert(1)',
      '&#0000106avascript:alert(1)',
      '&#106;avascript:alert(1)#fragment',
    ];

    itRejects(encoded);
  });

  describe('html entity encoded colons', () => {
    const encoded = [
      'javascript&colon;alert(1)',
      'JaVaScRiPt&colon;alert(1)',
      'javascript&#58;alert(1)',
      'javascript&#x3a;alert(1)',
      'javascript&#X3A;alert(1)',
      'javascript&#0000058;alert(1)',
      'data&colon;text/html,<script>alert(1)</script>',
      'vbscript&colon;msgbox(1)',
    ];

    itRejects(encoded);
  });

  describe('safe protocols', () => {
    const safe = [
      'https://trakt.tv/movies/heretic-2024',
      'http://trakt.tv/movies/heretic-2024',
      'HTTPS://trakt.tv/x',
      'mailto:support@trakt.tv',
      'https://trakt.tv/a?b=1&c=2',
      'https://trakt.tv/a&b',
      'mailto:support@trakt.tv?subject=a&body=b',
    ];

    itAllows(safe);
  });

  describe('relative urls', () => {
    const relative = [
      '/movies/heretic-2024',
      '../shows/silo',
      '#section',
      '',
      '//trakt.tv/movies',
      'foo/bar:baz',
      '?q=a:b',
      '/movies?a=1&b=2',
      '?a=1&b=2',
      '/movies/heretic-2024#a&b',
    ];

    itAllows(relative);
  });
});
