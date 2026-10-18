import { describe, expect, it } from 'vitest';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { parseMixtapeParams } from './parseMixtapeParams.ts';

const parse = (query: string) => parseMixtapeParams(new URLSearchParams(query));

describe('parseMixtapeParams', () => {
  it('should default to movies with no picks on the picker', () => {
    expect(parse('')).toEqual({
      type: 'movie',
      picks: [],
      skips: [],
      kept: [],
      savedTo: null,
      view: 'pick',
      source: null,
    });
  });

  it('should read shows, picks, skips, the results view and the source', () => {
    expect(
      parse('type=show&picks=1,2&skips=9&view=results&source=related'),
    ).toEqual({
      type: 'show',
      picks: [1, 2],
      skips: [9],
      kept: [],
      savedTo: null,
      view: 'results',
      source: 'related',
    });
  });

  it('should drop junk and duplicate ids and keep at most five picks', () => {
    expect(parse('picks=1,1,x,-3,0,2,3,4,5,6').picks).toEqual([1, 2, 3, 4, 5]);
  });

  it('should stay on the picker when results are asked for without picks', () => {
    expect(parse('view=results').view).toBe('pick');
  });

  it('should read the kept titles round by round, with an empty new round', () => {
    expect(parse('kept=1,2,3~4~').kept).toEqual([[1, 2, 3], [4], []]);
  });

  it('should read the list the mixtape was moved to', () => {
    expect(parse('to=42').savedTo).toBe(42);
    expect(parse('to=nope').savedTo).toBeNull();
  });

  it('should round-trip rounds and the list through the url builder', () => {
    const url = UrlBuilder.mixtape({
      picks: [7],
      kept: [[1, 2, 3], [4]],
      savedTo: 42,
      view: 'results',
    });
    const parsed = parseMixtapeParams(new URL(url, 'https://x').searchParams);

    expect(parsed.kept).toEqual([[1, 2, 3], [4]]);
    expect(parsed.savedTo).toBe(42);
  });

  it('should fall back to movies for an unknown type', () => {
    expect(parse('type=episode').type).toBe('movie');
  });
});
