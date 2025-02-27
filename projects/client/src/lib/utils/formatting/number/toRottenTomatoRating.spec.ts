import { describe, expect, it } from 'vitest';
import { toRottenTomatoRating } from './toRottenTomatoRating.ts';

describe('toRottenTomatoRating', () => {
  it('should return "unrated" when rating is 0', () => {
    expect(toRottenTomatoRating(0)).toBe('unrated');
  });

  it('should return "unrated" when there is no rating', () => {
    expect(toRottenTomatoRating()).toBe('unrated');
  });

  it('should return "rotten" when rating is less than 60', () => {
    expect(toRottenTomatoRating(59)).toBe('rotten');
    expect(toRottenTomatoRating(1)).toBe('rotten');
    expect(toRottenTomatoRating(30)).toBe('rotten');
  });

  it('should return "fresh" when rating is 60 or greater', () => {
    expect(toRottenTomatoRating(60)).toBe('fresh');
    expect(toRottenTomatoRating(75)).toBe('fresh');
    expect(toRottenTomatoRating(100)).toBe('fresh');
  });
});
