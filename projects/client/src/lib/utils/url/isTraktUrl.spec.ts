import { describe, expect, it } from 'vitest';
import { isTraktUrl } from './isTraktUrl.ts';

describe('util: isTraktUrl', () => {
  it.each([
    'https://trakt.tv',
    'https://app.trakt.tv/movies/heretic-2024',
    'http://trakt.tv/users/me',
    '/movies/heretic-2024',
    '#section',
    '?page=2',
  ])('should accept %s', (value) => {
    expect(isTraktUrl(value)).toBe(true);
  });

  it.each([
    'https://evil.example/login',
    'https://trakt.tv.evil.example',
    'https://eviltrakt.tv',
    'https://trakt.tv@evil.example',
    '//evil.example',
    '/\\evil.example',
    'mailto:support@trakt.tv',
    'javascript:alert(1)',
  ])('should reject %s', (value) => {
    expect(isTraktUrl(value)).toBe(false);
  });
});
