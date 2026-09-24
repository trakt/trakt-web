import { describe, expect, it } from 'vitest';
import { isHttpUrl } from './isHttpUrl.ts';

describe('util: isHttpUrl', () => {
  it.each([
    'https://media.trakt.tv/poster.jpg',
    'http://localhost/poster.jpg',
  ])('should accept %s', (value) => {
    expect(isHttpUrl(value)).toBe(true);
  });

  it.each([
    'data:image/png;base64,AAAA',
    '/placeholders/poster.png',
    'mailto:hello@trakt.tv',
    '',
  ])('should reject %s', (value) => {
    expect(isHttpUrl(value)).toBe(false);
  });
});
