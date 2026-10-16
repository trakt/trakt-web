import { describe, expect, it } from 'vitest';
import { parseMixtapeParams } from './parseMixtapeParams.ts';

const parse = (query: string) => parseMixtapeParams(new URLSearchParams(query));

describe('parseMixtapeParams', () => {
  it('should default to movies with no picks on the picker', () => {
    expect(parse('')).toEqual({
      type: 'movie',
      picks: [],
      skips: [],
      view: 'pick',
      source: null,
    });
  });

  it('should read shows, picks, skips, the results view and the source', () => {
    expect(parse('type=show&picks=1,2&skips=9&view=results&source=related'))
      .toEqual({
        type: 'show',
        picks: [1, 2],
        skips: [9],
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

  it('should fall back to movies for an unknown type', () => {
    expect(parse('type=episode').type).toBe('movie');
  });
});
