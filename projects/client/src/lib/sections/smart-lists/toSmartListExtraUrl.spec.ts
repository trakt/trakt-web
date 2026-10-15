import { describe, expect, it } from 'vitest';
import { fromSmartListExtraParams } from './fromSmartListExtraParams.ts';
import { toSmartListExtraUrl } from './toSmartListExtraUrl.ts';

describe('util: toSmartListExtraUrl', () => {
  it('should replace the extra filters and keep every other param', () => {
    const url = new URL(
      'http://localhost/lists/smart/create?genres=drama&keywords=heist&votes=100-999999999',
    );

    const next = toSmartListExtraUrl({
      url,
      filters: { keywords: ['time-travel'], ignore_ended: true },
    });

    expect(next.searchParams.get('genres')).toBe('drama');
    expect(next.searchParams.get('keywords')).toBe('time-travel');
    expect(next.searchParams.get('ignore_ended')).toBe('true');
    expect(next.searchParams.has('votes')).toBe(false);
  });

  it('should round trip through the url', () => {
    const filters = {
      studios: ['a24'],
      imdb_votes: [10_000, 999_999_999],
      watchnow_country: 'de',
      parental_include_unrated: true,
    };

    const url = toSmartListExtraUrl({
      url: new URL('http://localhost/lists/smart/create'),
      filters,
    });

    expect(fromSmartListExtraParams(url.searchParams)).toEqual(filters);
  });
});
