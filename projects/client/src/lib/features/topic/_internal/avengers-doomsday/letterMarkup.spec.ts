import { describe, expect, it } from 'vitest';
import { letterMarkup } from './letterMarkup.ts';

const letters = (markup: string) => [
  ...markup.matchAll(/<span class="doom-slam-letter"[^>]*>([^<]*)<\/span>/g),
];

describe('util: letterMarkup', () => {
  it('should wrap every letter of a word in its own span', () => {
    const markup = letterMarkup('Doom');

    expect(letters(markup).map((match) => match[1])).toEqual([
      'D',
      'o',
      'o',
      'm',
    ]);
  });

  it('should stagger the animation delay by letter across words', () => {
    const delays = [
      ...letterMarkup('ab cd').matchAll(/animation-delay:(\d+)ms/g),
    ].map((match) => Number(match[1]));

    expect(delays).toEqual([0, 34, 68, 102]);
  });

  it('should keep whitespace between words as a plain space', () => {
    const markup = letterMarkup('ab cd');

    expect(markup.match(/doom-slam-word/g)).toHaveLength(2);
    expect(markup).toContain('</span> <span class="doom-slam-word">');
  });

  it('should escape markup characters instead of dropping them', () => {
    const markup = letterMarkup('Law & <Order>');

    expect(letters(markup).map((match) => match[1])).toEqual([
      'L',
      'a',
      'w',
      '&amp;',
      '&lt;',
      'O',
      'r',
      'd',
      'e',
      'r',
      '&gt;',
    ]);
    expect(markup).not.toContain('<Order>');
  });
});
