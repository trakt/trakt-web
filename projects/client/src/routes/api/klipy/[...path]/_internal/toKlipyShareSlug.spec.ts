import { describe, expect, it } from 'vitest';
import { toKlipyShareSlug } from './toKlipyShareSlug.ts';

describe('util: toKlipyShareSlug', () => {
  it('should read the slug out of a share path', () => {
    expect(toKlipyShareSlug('gifs/share/dancing-cats-cq0--kUEHfwQTP'))
      .toBe('dancing-cats-cq0--kUEHfwQTP');
  });

  it('should refuse a path that is not a share ping', () => {
    expect(toKlipyShareSlug('gifs/trending')).toBeNull();
    expect(toKlipyShareSlug('gifs/report/some-slug')).toBeNull();
  });

  it('should refuse a slug that is not a slug', () => {
    expect(toKlipyShareSlug('gifs/share/')).toBeNull();
    expect(toKlipyShareSlug('gifs/share/../../account')).toBeNull();
    expect(toKlipyShareSlug('gifs/share/slug?api_key=stolen')).toBeNull();
    expect(toKlipyShareSlug(`gifs/share/${'a'.repeat(129)}`)).toBeNull();
  });
});
