import { describe, expect, it } from 'vitest';
import { isReviewValid } from './isReviewValid.ts';

describe('isReviewValid', () => {
  it('should return false for an empty string', () => {
    expect(isReviewValid('')).toBe(false);
  });

  it('should return false for fewer than 5 words', () => {
    expect(isReviewValid('one two three four')).toBe(false);
  });

  it('should return true for exactly 5 words', () => {
    expect(isReviewValid('one two three four five')).toBe(true);
  });

  it('should return true for more than 5 words', () => {
    expect(isReviewValid('one two three four five six')).toBe(true);
  });

  it('should return true for a typical comment', () => {
    expect(isReviewValid('This movie was absolutely fantastic and I loved it'))
      .toBe(true);
  });

  it('should not count extra whitespace as words', () => {
    expect(isReviewValid('  one   two   three   four  ')).toBe(false);
  });

  it('should return false for a string of only whitespace', () => {
    expect(isReviewValid('     ')).toBe(false);
  });

  it('should return false for tabs and newlines only', () => {
    expect(isReviewValid('\t\n  \r\n')).toBe(false);
  });

  it('should not count punctuation-only tokens as words', () => {
    expect(isReviewValid('... !! ?? -- :: ;; one two three four')).toBe(
      false,
    );
  });

  it('should count words separated by newlines correctly', () => {
    expect(isReviewValid('one\ntwo\nthree\nfour\nfive\nsix')).toBe(true);
  });

  it('should count words with emojis mixed with letters as valid words', () => {
    expect(isReviewValid('word1 word2 word3 word4 word5 word6')).toBe(true);
  });

  it('should not count standalone emojis as words', () => {
    expect(isReviewValid('😀 🎉 🔥 🌟 💯 one two three four')).toBe(
      false,
    );
  });

  it('should count enough real words even when emojis are present', () => {
    expect(
      isReviewValid(
        '😀 This 🎉 film 🔥 was 🌟 truly 💯 amazing and wonderful',
      ),
    ).toBe(true);
  });

  it('should handle mixed whitespace between words', () => {
    expect(isReviewValid('one  two\t three\nfour\r\nfive  six')).toBe(true);
  });

  it('should return false for fewer than 5 emoji-free words with surrounding emojis', () => {
    expect(isReviewValid('😀🎉🔥 one two three four 🌟💯')).toBe(false);
  });
});
