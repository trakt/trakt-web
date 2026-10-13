import { describe, expect, it } from 'vitest';
import { toRelativeMarkdownLinks } from './toRelativeMarkdownLinks.ts';

const ORIGIN = 'https://app.trakt.tv';

describe('toRelativeMarkdownLinks', () => {
  it('should make links on the given origin relative', () => {
    expect(
      toRelativeMarkdownLinks(
        '**[Tom Hanks](https://app.trakt.tv/people/tom-hanks)** met [Meg Ryan](https://app.trakt.tv/people/meg-ryan).',
        ORIGIN,
      ),
    ).toBe(
      '**[Tom Hanks](/people/tom-hanks)** met [Meg Ryan](/people/meg-ryan).',
    );
  });

  it('should leave links on other origins unchanged', () => {
    const text =
      '[IMDb](https://www.imdb.com/title/tt0133093) and [Trakt](https://trakt.tv/people/tom-hanks)';

    expect(toRelativeMarkdownLinks(text, ORIGIN)).toBe(text);
  });

  it('should leave the origin in plain text unchanged', () => {
    const text = 'Visit https://app.trakt.tv/people/tom-hanks for more.';

    expect(toRelativeMarkdownLinks(text, ORIGIN)).toBe(text);
  });
});
