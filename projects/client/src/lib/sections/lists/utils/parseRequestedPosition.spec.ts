import { describe, expect, it } from 'vitest';
import { parseRequestedPosition } from './parseRequestedPosition.ts';

describe('util: parseRequestedPosition', () => {
  it('should parse a valid position from the type-scoped search param', () => {
    const url = new URL('https://trakt.tv/people/jane-doe?movies=directing');

    const result = parseRequestedPosition(url, 'movie');

    expect(result).toBe('directing');
  });

  it('should match the search param case-insensitively', () => {
    const url = new URL('https://trakt.tv/people/jane-doe?shows=Directing');

    const result = parseRequestedPosition(url, 'show');

    expect(result).toBe('directing');
  });

  it('should default to acting when the search param is missing', () => {
    const url = new URL('https://trakt.tv/people/jane-doe');

    const result = parseRequestedPosition(url, 'movie');

    expect(result).toBe('acting');
  });

  it('should default to acting when the search param is not a known position', () => {
    const url = new URL('https://trakt.tv/people/jane-doe?movies=bogus');

    const result = parseRequestedPosition(url, 'movie');

    expect(result).toBe('acting');
  });
});
