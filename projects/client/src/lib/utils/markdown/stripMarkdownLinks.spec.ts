import { describe, expect, it } from 'vitest';
import { stripMarkdownLinks } from './stripMarkdownLinks.ts';

describe('stripMarkdownLinks', () => {
  it('should keep only the link label', () => {
    expect(
      stripMarkdownLinks(
        '**[Tom Hanks](https://app.trakt.tv/people/tom-hanks)** met [Meg Ryan](https://app.trakt.tv/people/meg-ryan).',
      ),
    ).toBe('**Tom Hanks** met Meg Ryan.');
  });

  it('should leave text without links unchanged', () => {
    expect(stripMarkdownLinks('Tom Hanks *ran* [far].')).toBe(
      'Tom Hanks *ran* [far].',
    );
  });
});
